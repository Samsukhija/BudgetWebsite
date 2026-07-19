// scene-home.js, three.js hero scene + five-act scroll choreography.
// Only runs on window.BW_TIER === 'full' (set by js/perf-gate.js). The CSS
// fallback (.grad-bg alone, #scene-canvas hidden) is the intentional static
// experience and needs zero help from this file.
import * as THREE from '../vendor/three.module.min.js';

(function () {
  if (window.BW_TIER !== 'full') return;

  var canvas = document.getElementById('scene-canvas');
  if (!canvas) return;

  var GRAD_A = 0x7C3AED, GRAD_B = 0x3B82F6, GRAD_C = 0xEC4899;

  // true once the render loop has been permanently torn down (downgrade to
  // static tier). Once set, nothing is allowed to resurrect the loop.
  var torn = false;

  // ---- renderer -----------------------------------------------------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true });
  } catch (e) {
    return; // context creation failed outright, leave the CSS fallback in place
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ---- software-renderer sniff (Task 1 gap fix) ----------------------
  // hardwareConcurrency + "can I get a context" both pass on SwiftShader/
  // llvmpipe machines that then render at 3fps. Catch that before spending
  // any more time building the scene, and bail out of init entirely.
  function detectSoftwareRenderer() {
    try {
      var gl = renderer.getContext();
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (!dbg) return null;
      var raw = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      var flags = ['swiftshader', 'llvmpipe', 'software', 'microsoft basic render', 'basic render driver'];
      for (var i = 0; i < flags.length; i++) {
        if (raw.indexOf(flags[i]) !== -1) return raw;
      }
      return null;
    } catch (e) { return null; } // extension unavailable/blocked, can't tell, proceed normally
  }
  var softwareRenderer = detectSoftwareRenderer();
  if (softwareRenderer) {
    torn = true; // scene/observer/listener never get built past this point, but
                 // set defensively in case that changes later
    if (typeof console !== 'undefined') console.warn('[scene-home] software renderer detected, staying on static tier:', softwareRenderer);
    window.BW_TIER = 'static';
    document.documentElement.setAttribute('data-tier', 'static');
    canvas.style.display = 'none';
    document.querySelectorAll('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    // Same [data-stagger] gap as downgradeToStatic() below -- motion.js may
    // already have applied gsap.fromTo()'s {opacity:0,y:24} "from" state to
    // stagger children based on the perf-gate's initial (optimistic) tier
    // reading, before this software-renderer check ran. Force them visible.
    document.querySelectorAll('[data-stagger] > *').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(function (st) {
        var trig = st.trigger;
        if (trig && (trig.classList.contains('reveal') || trig.hasAttribute('data-stagger'))) {
          try { st.kill(); } catch (e) {}
        }
      });
    }
    try { renderer.dispose(); } catch (e) {}
    return; // don't build the scene at all
  }

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0A0A1A, 8, 18);

  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, 0, 9);

  // rig holds everything that should drift/rotate together under pointer parallax
  var rig = new THREE.Group();
  scene.add(rig);

  var slabs = [];       // { mesh, baseOpacity, baseColorIdx, driftDir }
  var particles = null; // THREE.Points
  var particleMat = null;
  var glowSprite = null;

  // ---- lights ---------------------------------------------------------
  function buildLights() {
    var l1 = new THREE.PointLight(GRAD_A, 6, 30);
    l1.position.set(-4, 2, 4);
    var l2 = new THREE.PointLight(GRAD_B, 6, 30);
    l2.position.set(4, -2, 3);
    var l3 = new THREE.PointLight(GRAD_C, 5, 30);
    l3.position.set(0, 3, -4);
    var amb = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(l1, l2, l3, amb);
  }

  // ---- slabs ------------------------------------------------------------
  function buildSlabs() {
    var COUNT = 32; // within the 24-40 band
    var geo = new THREE.BoxGeometry(1.6, 1, 0.04);
    var colors = [GRAD_A, GRAD_B, GRAD_C];
    for (var i = 0; i < COUNT; i++) {
      var opacity = 0.16 + Math.random() * 0.14; // 0.16-0.30
      var mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: opacity,
        roughness: 0.2,
        metalness: 0.6,
        depthWrite: false
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 9 - 2
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      rig.add(mesh);
      slabs.push({
        mesh: mesh,
        baseOpacity: opacity,
        driftDir: new THREE.Vector3(
          (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)
        ).normalize(),
        spinSpeed: (Math.random() - 0.5) * 0.15
      });
    }
  }

  // ---- particles ----------------------------------------------------
  function buildParticles() {
    var COUNT = 800; // within the 600-1000 band
    var positions = new Float32Array(COUNT * 3);
    for (var i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleMat = new THREE.PointsMaterial({
      color: 0xC9CEFF,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    particles = new THREE.Points(geo, particleMat);
    rig.add(particles);
  }

  // ---- glow sprite (concentrates behind the final CTA) ----------------
  function makeGlowTexture() {
    var size = 256;
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(139,92,246,0.9)');
    g.addColorStop(0.5, 'rgba(59,130,246,0.35)');
    g.addColorStop(1, 'rgba(10,10,26,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function buildGlow() {
    var mat = new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false // the scene fog would otherwise wash this out at the pulled-back
                 // camera distance reached by the end of the scroll choreography-
                 // the glow is meant to punch through the recede, not fade with it
    });
    glowSprite = new THREE.Sprite(mat);
    glowSprite.scale.set(3, 3, 1);
    glowSprite.position.set(0, 0, -3);
    scene.add(glowSprite); // outside rig, stays camera-facing, not part of pointer parallax drift
  }

  // ---- pointer parallax -----------------------------------------------
  var pointerTarget = { x: 0, y: 0 };
  var pointerCurrent = { x: 0, y: 0 };
  function bindPointer() {
    window.addEventListener('pointermove', function (e) {
      pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
      pointerTarget.y = (e.clientY / window.innerHeight - 0.5) * 2; // -1..1
    }, { passive: true });
  }

  // ---- scroll choreography (GSAP ScrollTrigger, scrubbed) -------------
  var scrollState = { spread: 0, particleFade: 0, contact: 0 };
  var scrollTriggers = [];
  function bindScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    scrollTriggers.push(ScrollTrigger.create({
      trigger: '#act-value',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: function (self) { scrollState.spread = self.progress; }
    }));

    scrollTriggers.push(ScrollTrigger.create({
      trigger: '#act-proof',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onUpdate: function (self) { scrollState.particleFade = self.progress; }
    }));

    scrollTriggers.push(ScrollTrigger.create({
      trigger: '#act-contact',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
      onUpdate: function (self) { scrollState.contact = self.progress; }
    }));
  }

  // ---- visibility-based pause/resume -----------------------------------
  var running = false;
  var rafId = null;
  var tabVisible = !document.hidden;
  var scrollVisible = true;
  var intersectingActs = new Set();
  var io = null; // IntersectionObserver, hoisted so downgradeToStatic() can disconnect it

  function updateRunState() {
    // once torn down (permanent downgrade), never allow the loop to restart-
    // a late-firing visibilitychange or IntersectionObserver callback must not
    // resurrect requestAnimationFrame(tick) against a disposed renderer.
    if (torn) {
      if (running) stopLoop();
      return;
    }
    var shouldRun = tabVisible && scrollVisible;
    if (shouldRun && !running) startLoop();
    if (!shouldRun && running) stopLoop();
  }

  function onVisibilityChange() {
    tabVisible = !document.hidden;
    updateRunState();
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  function bindVisibilityObserver() {
    var acts = document.querySelectorAll('body > .act');
    if (!acts.length || typeof IntersectionObserver === 'undefined') return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) intersectingActs.add(entry.target);
        else intersectingActs.delete(entry.target);
      });
      scrollVisible = intersectingActs.size > 0;
      updateRunState();
    }, { threshold: 0 });
    acts.forEach(function (el) { io.observe(el); });
  }

  // ---- runtime perf downgrade (Task 1 gap fix) -------------------------
  var perfCheckFrames = 0;
  var perfCheckLimit = 40;
  var perfCheckTotalMs = 0;
  var perfCheckDone = false;
  var lastFrameTime = null;

  function checkRealPerformance(now) {
    if (perfCheckDone) return;
    if (lastFrameTime !== null) {
      perfCheckTotalMs += (now - lastFrameTime);
      perfCheckFrames++;
    }
    lastFrameTime = now;
    if (perfCheckFrames >= perfCheckLimit) {
      perfCheckDone = true;
      var avgMs = perfCheckTotalMs / perfCheckFrames;
      if (avgMs > (1000 / 24)) { // sustained sub-24fps
        downgradeToStatic('sustained low fps, avg frame ' + avgMs.toFixed(1) + 'ms');
      }
    }
  }

  // frees GPU-side geometry/material/texture buffers for everything left in
  // the scene graph, renderer.dispose() alone only clears the renderer's
  // own internal caches, not the objects still parented under `scene`.
  function disposeSceneResources() {
    scene.traverse(function (obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
        } else {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      }
    });
  }

  function downgradeToStatic(reason) {
    torn = true; // permanently forbid the loop from restarting, before anything else
    if (typeof console !== 'undefined') console.warn('[scene-home] downgrading to static tier:', reason);
    stopLoop();
    window.BW_TIER = 'static';
    document.documentElement.setAttribute('data-tier', 'static');
    canvas.style.display = 'none';
    // motion.js may have left .reveal elements at opacity:0 (inline style,
    // which beats the [data-tier="static"] CSS rule) waiting for a scroll
    // trigger that assumed full tier, force them visible directly.
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    // Same problem hits [data-stagger] children: motion.js's gsap.fromTo()
    // applies its {opacity:0, y:24} "from" state synchronously the moment it's
    // called, before the scroll trigger ever fires. If tier flips to static
    // AFTER that (this downgrade), those children are stuck invisible until
    // scrolled into view, which defeats "static tier = show everything
    // immediately, no motion." Force them visible too.
    document.querySelectorAll('[data-stagger] > *').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(function (st) {
        var trig = st.trigger;
        if (trig && (trig.classList.contains('reveal') || trig.hasAttribute('data-stagger'))) {
          try { st.kill(); } catch (e) {}
        }
      });
    }
    scrollTriggers.forEach(function (st) { try { st.kill(); } catch (e) {} });
    // disconnect the event sources that call updateRunState(), belt-and-
    // braces alongside the `torn` guard so they can't even fire again.
    if (io) { try { io.disconnect(); } catch (e) {} }
    document.removeEventListener('visibilitychange', onVisibilityChange);
    disposeSceneResources();
    try { renderer.dispose(); } catch (e) {}
  }

  // ---- render loop -----------------------------------------------------
  var clock = new THREE.Clock();
  var clockStarted = false; // clock.start() resets elapsedTime to 0, only do it once,
                             // so pause/resume (tab refocus, scroll in/out) doesn't snap
                             // the camera dolly / particle rotation phase back to the start

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (!perfCheckDone) checkRealPerformance(now);

    var t = clock.getElapsedTime();

    // camera dolly: sinusoidal 9 -> 7 -> 9 over a 12s loop
    var dollyZ = 8 - Math.cos((t / 12) * Math.PI * 2);
    // scroll pullback: camera eases further back through act-value,
    // and stays back for the rest of the page
    var pullback = scrollState.spread * 3 + scrollState.contact * 1.5;
    camera.position.z = dollyZ + pullback;

    // pointer parallax on the rig, lerped toward the pointer target, clamped to ±0.4 rad
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.05;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.05;
    rig.rotation.y = pointerCurrent.x * 0.4;
    rig.rotation.x = pointerCurrent.y * 0.4;

    // slabs: gentle spin + drift apart as spread progresses, opacity collapses near contact
    var spreadDist = scrollState.spread * 4;
    var opacityMul = 1 - scrollState.contact * 0.96; // -> 0.04 at full contact progress
    for (var i = 0; i < slabs.length; i++) {
      var s = slabs[i];
      s.mesh.rotation.z += s.spinSpeed * 0.01;
      if (!s.basePos) s.basePos = s.mesh.position.clone(); // capture original placement once
      var offset = s.driftDir.clone().multiplyScalar(spreadDist);
      s.mesh.position.copy(s.basePos).add(offset);
      s.mesh.material.opacity = s.baseOpacity * opacityMul;
    }

    // particles: fade out through act-proof, and drift slightly for life
    if (particleMat) {
      particleMat.opacity = 0.55 * (1 - scrollState.particleFade);
      particles.rotation.y = t * 0.01;
    }

    // glow: concentrates behind the final CTA
    if (glowSprite) {
      glowSprite.material.opacity = scrollState.contact * 0.85;
      var scale = 3 + scrollState.contact * 6;
      glowSprite.scale.set(scale, scale, 1);
    }

    renderer.render(scene, camera);
  }

  function startLoop() {
    if (running) return;
    running = true;
    if (!clockStarted) { clock.start(); clockStarted = true; }
    rafId = requestAnimationFrame(tick);
  }
  function stopLoop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ---- boot --------------------------------------------------------
  function init() {
    buildLights();
    buildSlabs();
    buildParticles();
    buildGlow();
    bindPointer();
    bindScroll();
    bindVisibilityObserver();
    window.addEventListener('resize', onResize, { passive: true });
    updateRunState();
  }

  init();
})();
