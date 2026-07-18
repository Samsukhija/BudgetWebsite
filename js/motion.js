// Shared motion utilities. Requires gsap + ScrollTrigger already loaded (classic scripts).
(function () {
  if (window.BW_TIER === 'static' || typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Scroll reveals: any .reveal element animates in when 80% into view.
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true }
    });
  });

  // Stagger groups: container with [data-stagger] animates its children.
  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    gsap.fromTo(group.children, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 78%', once: true }
    });
  });

  // Tilt-on-hover: any .tilt-card
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });
})();
