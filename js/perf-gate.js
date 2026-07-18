// Device-tier gate. Runs before any scene code. Sets <html data-tier="full|static">.
// "static" = animated CSS gradient only, no WebGL. This IS the intentional mobile/low-end experience.
window.BW_TIER = (function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
    if ((navigator.hardwareConcurrency || 0) > 0 && navigator.hardwareConcurrency <= 4) return 'static';
    var c = document.createElement('canvas');
    var gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'static';
    return 'full';
  } catch (e) { return 'static'; }
})();
document.documentElement.setAttribute('data-tier', window.BW_TIER);
