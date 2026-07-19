/* BW_ICONS: inline SVG icon set (Lucide-style strokes, currentColor).
   One shared library so tools, templates, and info panels stop using emoji
   as icons and render crisp, theme-tinted glyphs instead. */
window.BW_ICONS = (function () {
  'use strict';
  function w(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  return {
    /* finance & docs */
    receipt: w('<path d="M4 3v18l2.5-1.5L9 21l3-1.5L15 21l2.5-1.5L20 21V3l-2.5 1.5L15 3l-3 1.5L9 3 6.5 4.5 4 3Z"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>'),
    fileText: w('<path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z"/><path d="M14 3v4h4M9.5 12.5h5M9.5 16h5"/>'),
    wallet: w('<path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1"/><path d="M16 13.5h.01"/>'),
    banknote: w('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6 12h.01M18 12h.01"/>'),
    calculator: w('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7h7"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 18.5h.01M12 18.5h.01M15.5 18.5h.01"/>'),
    /* sales & people */
    target: w('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="1.4"/>'),
    bellRing: w('<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10.2 19.5a2 2 0 0 0 3.6 0"/><path d="M2.5 6.5a8 8 0 0 1 2-3M21.5 6.5a8 8 0 0 0-2-3"/>'),
    users: w('<circle cx="9" cy="8.5" r="3.5"/><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5"/><path d="M16 5.5a3.5 3.5 0 0 1 0 6.4M18 14.9c1.7.8 2.7 2.5 3 5.1"/>'),
    kanban: w('<path d="M5 4v11M12 4v6M19 4v13"/><path d="M3.5 4h3M10.5 4h3M17.5 4h3"/>'),
    idCard: w('<rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.8 16c.4-1.5 1.4-2.3 2.7-2.3s2.3.8 2.7 2.3"/><path d="M14.5 9.5h4M14.5 13h4"/>'),
    scanLine: w('<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10"/>'),
    /* time & ops */
    calendar: w('<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10.5h17"/>'),
    calendarCheck: w('<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10.5h17"/><path d="m9 15.5 2 2 4-4"/>'),
    package: w('<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10M8 5l8 4"/>'),
    truck: w('<path d="M2.5 6h11v10h-11z"/><path d="M13.5 10h4l3.5 3.5V16h-7.5"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>'),
    folder: w('<path d="M3 6a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/>'),
    repeat: w('<path d="M17 3.5 21 7l-4 3.5"/><path d="M21 7H8a4.5 4.5 0 0 0-4.5 4.5"/><path d="M7 20.5 3 17l4-3.5"/><path d="M3 17h13a4.5 4.5 0 0 0 4.5-4.5"/>'),
    /* writing & marketing */
    mail: w('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
    messageCircle: w('<path d="M12 3.5a8.5 8.5 0 1 0-7.6 12.4L3 21l5.3-1.3A8.5 8.5 0 1 0 12 3.5Z"/>'),
    camera: w('<path d="M4 7.5h3l1.5-2.5h7L17 7.5h3a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18V9A1.5 1.5 0 0 1 4 7.5Z"/><circle cx="12" cy="13.5" r="3.5"/>'),
    star: w('<path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.1L12 16.9 6.4 20l1.3-6.1L3 9.6l6.3-.7L12 3Z"/>'),
    sparkles: w('<path d="M12 4.5 13.8 9l4.7 1.8-4.7 1.8L12 17l-1.8-4.4L5.5 10.8 10.2 9 12 4.5Z"/><path d="M19 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/><path d="M5 3l.7 1.6L7.3 5.3 5.7 6 5 7.6 4.3 6 2.7 5.3 4.3 4.6 5 3Z"/>'),
    penLine: w('<path d="M3 21h18"/><path d="M15.5 4.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L15.5 4.5Z"/>'),
    bookOpen: w('<path d="M12 6c-1.8-1.6-4.2-2-8-2v14c3.8 0 6.2.4 8 2 1.8-1.6 4.2-2 8-2V4c-3.8 0-6.2.4-8 2Z"/><path d="M12 6v14"/>'),
    mapPin: w('<path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
    /* trades */
    dumbbell: w('<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>'),
    scissors: w('<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8.1 7.6 20 19M8.1 16.4 20 5"/>'),
    car: w('<path d="M4 16v-4l2-5h12l2 5v4"/><path d="M2.5 16h19"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/><path d="M6 12h12"/>'),
    coffee: w('<path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M7.5 3.5v2.5M11 3.5v2.5M14.5 3.5v2.5"/>'),
    utensils: w('<path d="M7 3v8M4.5 3v4a2.5 2.5 0 0 0 5 0V3"/><path d="M7 11v10"/><path d="M17 3c-1.7 1-3 3.2-3 6 0 2 1 3 3 3v9"/>'),
    gem: w('<path d="M7 3h10l4 6-9 12L3 9l4-6Z"/><path d="M3 9h18M9.5 3 12 9l2.5-6M12 9l0 12"/>'),
    flower: w('<circle cx="12" cy="12" r="2.6"/><path d="M12 9.4a3.2 3.2 0 1 0-3.2-3.2c0 1.8 1.4 3.2 3.2 3.2Zm0 0a3.2 3.2 0 1 1 3.2-3.2M12 14.6a3.2 3.2 0 1 1-3.2 3.2c0-1.8 1.4-3.2 3.2-3.2Zm0 0a3.2 3.2 0 1 0 3.2 3.2M9.4 12a3.2 3.2 0 1 0-3.2 3.2M14.6 12a3.2 3.2 0 1 1 3.2 3.2M9.4 12a3.2 3.2 0 1 1-3.2-3.2M14.6 12a3.2 3.2 0 1 0 3.2-3.2"/>'),
    microscope: w('<path d="M6 21h12M9.5 18a6 6 0 0 0 8.5-5.5A6 6 0 0 0 14 7"/><path d="M9 3l4 4-4.5 4.5-4-4L9 3ZM7 9.5 5.5 11"/><path d="M4 21a4 4 0 0 1 4-3"/>'),
    ruler: w('<path d="M3 17 17 3l4 4L7 21l-4-4Z"/><path d="m7.5 12.5 1.8 1.8M10.5 9.5l1.8 1.8M13.5 6.5l1.8 1.8"/>'),
    shirt: w('<path d="M8 4 3.5 7.5 6 10.5l2-1.5V20h8v-11l2 1.5 2.5-3L16 4a4 4 0 0 1-8 0Z"/>'),
    stethoscope: w('<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M5 3h2M13 3h2"/><path d="M10 14v2.5a4.5 4.5 0 0 0 9 0V15"/><circle cx="19" cy="12.5" r="1.8"/>'),
    building: w('<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M10 21v-3h4v3"/>'),
    armchair: w('<path d="M6 10V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/><path d="M4 13a2 2 0 0 1 4 0v2h8v-2a2 2 0 0 1 4 0v5H4v-5Z"/><path d="M5.5 18v2M18.5 18v2"/>'),
    cookie: w('<circle cx="12" cy="12" r="9"/><path d="M9 9h.01M15 10h.01M10 15h.01M14.5 14.5h.01M12 12h.01"/>'),
    chefHat: w('<path d="M7 13a4 4 0 1 1 1-7.9 5 5 0 0 1 8 0A4 4 0 1 1 17 13v5H7v-5Z"/><path d="M7 20.5h10"/>'),
    plane: w('<path d="M10 13 3 11l1-2 6.5 1L15 4.5a1.6 1.6 0 0 1 2.5 2L13 12l1 6.5-2 1-2-7"/><path d="M4.5 19.5h15"/>'),
    hospitalCross: w('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/>'),
    cake: w('<path d="M4 13a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7H4v-7Z"/><path d="M4 16c1.5 1.2 3 .2 4-.6 1 .8 2.5 1.8 4 .6 1.5 1.2 3 .2 4-.6 1 .8 2.5 1.8 4 .6"/><path d="M12 8v3M12 5.5a1 1 0 0 0 1-1c0-.6-1-1.8-1-1.8s-1 1.2-1 1.8a1 1 0 0 0 1 1Z"/>'),
    scale: w('<path d="M12 3v18M8 21h8"/><path d="m5 7 7-2 7 2"/><path d="M5 7 3 13a3.2 3.2 0 0 0 4 0L5 7ZM19 7l-2 6a3.2 3.2 0 0 0 4 0l-2-6Z"/>'),
    tooth: w('<path d="M8 3.5c-2.5 0-4 2-4 4.5 0 4 2 5 2.5 8.5.3 2 .8 4 2 4 1.5 0 1-4.5 3.5-4.5s2 4.5 3.5 4.5c1.2 0 1.7-2 2-4C18 13 20 12 20 8c0-2.5-1.5-4.5-4-4.5-1.5 0-2.5 1-4 1s-2.5-1-4-1Z"/>'),
    factory: w('<path d="M3 21V9l6 4V9l6 4V4h6v17H3Z"/><path d="M7 17h.01M11 17h.01M17 17h.01M17 9h.01"/>'),
    shield: w('<path d="M12 3 4.5 6v6c0 4.5 3 7.6 7.5 9 4.5-1.4 7.5-4.5 7.5-9V6L12 3Z"/><path d="m9 12 2 2 4-4"/>'),
    compass: w('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>'),
    wrench: w('<path d="M14 6.5a4.5 4.5 0 0 0 6 4.3L13 18l-3-3 7.2-7a4.5 4.5 0 0 0-3.2-1.5Z" transform="rotate(90 14 12)"/><path d="M14.7 6.3a4.5 4.5 0 1 0-5.4 7L4 18.5 5.5 20l5.2-5.3a4.5 4.5 0 0 0 7-5.4l-3 3-2.5-.5-.5-2.5 3-3Z"/>'),
    briefcase: w('<rect x="3" y="7.5" width="18" height="13" rx="2"/><path d="M9 7.5V5.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),
    hammer: w('<path d="m14 5 6 6-2 2-6-6"/><path d="M12 7 4.5 14.5a1.7 1.7 0 0 0 0 2.4l2.6 2.6a1.7 1.7 0 0 0 2.4 0L17 12"/><path d="M13 4c1-1 3-1.5 4.5-.5L20 6"/>'),
    layers: w('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m4.5 12.5 7.5 4 7.5-4M4.5 17l7.5 4 7.5-4"/>'),
    printer: w('<path d="M7 8V3h10v5"/><rect x="3.5" y="8" width="17" height="9" rx="2"/><path d="M7 14h10v7H7z"/><path d="M17.5 11h.01"/>'),
    heart: w('<path d="M12 20.5s-8-4.7-8-11a4.6 4.6 0 0 1 8-3.1 4.6 4.6 0 0 1 8 3.1c0 6.3-8 11-8 11Z"/>'),
    moonStar: w('<path d="M14 3.5a8.5 8.5 0 1 0 6.5 12A7 7 0 0 1 14 3.5Z"/><path d="M18 3l.7 1.8L20.5 5.5l-1.8.7L18 8l-.7-1.8-1.8-.7 1.8-.7L18 3Z"/>'),
    palette: w('<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2 0-2.5 1.5-2.5H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5Z"/><path d="M7.5 11h.01M10.5 7h.01M15 7.5h.01M17.5 11.5h.01"/>'),
    /* info panel */
    listChecks: w('<path d="m3.5 6 1.5 1.5L8 4.5"/><path d="m3.5 12.5 1.5 1.5L8 11"/><path d="m3.5 19 1.5 1.5L8 17.5"/><path d="M11.5 6H21M11.5 12.5H21M11.5 19H21"/>'),
    coins: w('<circle cx="8.5" cy="8.5" r="5.5"/><path d="M8.5 6v5M6.5 7.5h4"/><path d="M14.5 9.7a5.5 5.5 0 1 1-4.8 9.1"/><path d="M17 14.5h.01M15 19.5h.01"/>'),
    /* home page */
    shoppingBag: w('<path d="M6 7h12l1.5 13a1.4 1.4 0 0 1-1.4 1.5H5.9A1.4 1.4 0 0 1 4.5 20L6 7Z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/>'),
    phone: w('<path d="M5 3.5h3.5L10.5 8 8.4 9.6a12.5 12.5 0 0 0 6 6L16 13.5l4.5 2V19a2 2 0 0 1-2 2C10.5 21 3 13.5 3 5.5a2 2 0 0 1 2-2Z"/>'),
    zap: w('<path d="M13 2.5 4.5 13.5H11l-1 8L18.5 10.5H12l1-8Z"/>'),
    rocket: w('<path d="M12 15l-3-3c.7-3.5 2.5-6.8 5.5-9 4-3 7-2.5 7-2.5s.5 3-2.5 7c-2.2 3-5.5 4.8-9 5.5Z"/><path d="M9 12H4.5s.5-3 2-4.5S10.5 6.5 10.5 6.5"/><path d="M12 15v4.5s3-.5 4.5-2 1-4 1-4"/><path d="M4.5 16.5c-1 1-1.5 3-1.5 4.5 1.5 0 3.5-.5 4.5-1.5"/><circle cx="15" cy="9" r="1.4"/>'),
  };
})();
