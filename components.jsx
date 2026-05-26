// Zive — Mercury-inspired dark UI components
const { useState, useEffect, useRef, Fragment, useMemo } = React;

// ────────────── Icon set ──────────────
// Tabler icon paths — https://tabler.io/icons (MIT). 24×24 viewBox, stroke-based.
const Icon = ({ name, size = 16, color = "currentColor", strokeWidth = 1.75, style }) => {
  const paths = {
    home: <><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></>,
    tasks: <><path d="M9 6l11 0"/><path d="M9 12l11 0"/><path d="M9 18l11 0"/><path d="M5 6l0 .01"/><path d="M5 12l0 .01"/><path d="M5 18l0 .01"/></>,
    accounts: <><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M3 10l18 0"/><path d="M7 15l.01 0"/><path d="M11 15l2 0"/></>,
    pie: <><path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8"/><path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5"/></>,
    tx: <><path d="M7 10h14l-4 -4"/><path d="M17 14h-14l4 4"/></>,
    cards: <><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M3 10l18 0"/><path d="M7 15l.01 0"/><path d="M11 15l2 0"/></>,
    pay: <><path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"/><path d="M12 3v3m0 12v3"/></>,
    invoice: <><path d="M5 21v-16a2 2 0 0 1 2 -2h7l5 5v13a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M9 17h6"/><path d="M9 13h6"/></>,
    reimburse: <><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747"/><path d="M20 4v5h-5"/></>,
    doc: <><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M20 18v3"/><path d="M16 16v5"/><path d="M12 13v8"/><path d="M8 16v5"/><path d="M4 11l5 -7l4 6l5 -4l4 5"/></>,
    trendUp: <><path d="M3 17l6 -6l4 4l8 -8"/><path d="M14 7l7 0l0 7"/></>,
    wire: <><path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"/><path d="M3 10l18 0"/></>,
    building: <><path d="M3 21l18 0"/><path d="M9 8l1 0"/><path d="M9 12l1 0"/><path d="M9 16l1 0"/><path d="M14 8l1 0"/><path d="M14 12l1 0"/><path d="M14 16l1 0"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/></>,
    download: <><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></>,
    search: <><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/></>,
    bell: <><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></>,
    eye: <><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"/></>,
    eyeOff: <><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"/><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"/><path d="M3 3l18 18"/></>,
    settings: <><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/></>,
    chevronR: <><path d="M9 6l6 6l-6 6"/></>,
    chevronD: <><path d="M6 9l6 6l6 -6"/></>,
    chevronL: <><path d="M15 6l-6 6l6 6"/></>,
    plus: <><path d="M12 5l0 14"/><path d="M5 12l14 0"/></>,
    arrowUR: <><path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/></>,
    arrowDR: <><path d="M7 7l10 10"/><path d="M17 8l0 9l-9 0"/></>,
    arrowR: <><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></>,
    arrowL: <><path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/></>,
    filter: <><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"/></>,
    sort: <><path d="M3 9l4 -4l4 4m-4 -4v14"/><path d="M21 15l-4 4l-4 -4m4 4v-14"/></>,
    more: <><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></>,
    moreV: <><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></>,
    move: <><path d="M18 9l3 3l-3 3"/><path d="M15 12h6"/><path d="M6 9l-3 3l3 3"/><path d="M3 12h6"/></>,
    upload: <><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 9l5 -5l5 5"/><path d="M12 4l0 12"/></>,
    bookmark: <><path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z"/></>,
    command: <><path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"/></>,
    check: <><path d="M5 12l5 5l10 -10"/></>,
    sparkle: <><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></>,
    external: <><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/><path d="M11 13l9 -9"/><path d="M15 4h5v5"/></>,
    close: <><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></>,
    folder: <><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"/></>,
    copy: <><path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"/><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"/></>,
    bank: <><path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7 -3l7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/></>,
    grid: <><path d="M4 4h6v6h-6z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6h-6z"/><path d="M14 14h6v6h-6z"/></>,
    list: <><path d="M9 6l11 0"/><path d="M9 12l11 0"/><path d="M9 18l11 0"/><path d="M5 6l0 .01"/><path d="M5 12l0 .01"/><path d="M5 18l0 .01"/></>,
    store: <><path d="M3 21l18 0"/><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4"/><path d="M5 21l0 -10.15"/><path d="M19 21l0 -10.15"/><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"/></>,
    link: <><path d="M9 15l6 -6"/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/></>,
    send: <><path d="M10 14l11 -11"/><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -8l-8 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/></>,
    request: <><path d="M5 12l14 0"/><path d="M5 12l4 4"/><path d="M5 12l4 -4"/></>,
    deposit: <><path d="M12 13v8l-3 -3"/><path d="M12 21l3 -3"/><path d="M16 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2"/><path d="M9 7l3 -3l3 3"/><path d="M12 4l0 9"/></>,
    transfer: <><path d="M3 7h11"/><path d="M9 17h11"/><path d="M3 7l4 -4"/><path d="M3 7l4 4"/><path d="M20 17l-4 -4"/><path d="M20 17l-4 4"/></>,
    help: <><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 17l0 .01"/><path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4"/></>,
    receipt: <><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2"/><path d="M9 7l6 0"/><path d="M9 11l6 0"/><path d="M9 15l4 0"/></>,
    flag: <><path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z"/><path d="M5 21v-7"/></>,
    lightning: <><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/></>,
    users: <><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/></>,
    glasses: <><path d="M8 4l-2 0l-3 10"/><path d="M16 4l2 0l3 10"/><path d="M10 16l4 0"/><path d="M3 14a3 3 0 1 0 7 0a3 3 0 0 0 -7 0"/><path d="M14 14a3 3 0 1 0 7 0a3 3 0 0 0 -7 0"/></>,
    power: <><path d="M7 6a7.75 7.75 0 1 0 10 0"/><path d="M12 4l0 8"/></>,
    sun: <><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></>,
    moon: <><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></>,
    sparkle2: <><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></>,
    logoZ: <><path d="M6 6h12l-12 12h12"/></>,
    shieldCheck: <><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"/><path d="M15 19l2 2l4 -4"/></>,
    checklist: <><path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6.5"/><path d="M14 19l2 2l4 -4"/><path d="M9 8h4"/><path d="M9 12h2"/></>,
    tree: <><path d="M12 3l0 18"/><path d="M3 7.5a4.5 4.5 0 0 0 9 0a4.5 4.5 0 0 0 -9 0"/><path d="M12 7.5a4.5 4.5 0 0 0 9 0a4.5 4.5 0 0 0 -9 0"/></>,
    dashboard: <><path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M13.45 11.55l2.05 -2.05"/><path d="M6.4 20a9 9 0 1 1 11.2 0z"/></>,
    investor: <><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/></>,
    capitalCall: <><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"/><path d="M12 6v2m0 8v2"/></>,
    distribution: <><path d="M3 12l18 0"/><path d="M3 12l4 -4"/><path d="M3 12l4 4"/><path d="M21 12l-4 -4"/><path d="M21 12l-4 4"/></>,
    aiUpload: <><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M12 17v-6"/><path d="M9.5 13.5l2.5 -2.5l2.5 2.5"/></>,
    agent: <><path d="M12 8a2 2 0 0 0 -2 2v4a2 2 0 1 0 4 0v-4a2 2 0 0 0 -2 -2z"/><path d="M12 4a8 8 0 1 0 8 8"/><path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4z"/></>,
    docStudio: <><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 17l3 -3l3 3"/><path d="M12 14v6"/></>,
    mcp: <><path d="M12 3v3m0 12v3m9 -9h-3m-12 0h-3m15.5 -6.5l-2 2m-9 9l-2 2m13 0l-2 -2m-9 -9l-2 -2"/><path d="M12 9a3 3 0 1 1 0 6a3 3 0 0 1 0 -6"/></>,
    accounting: <><path d="M9 14l2 2l4 -4"/><path d="M5 21v-16a2 2 0 0 1 2 -2h7l5 5v13a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/></>,
    report: <><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"/><path d="M9 12l.01 0"/><path d="M13 12l2 0"/><path d="M9 16l.01 0"/><path d="M13 16l2 0"/></>,
    quarterly: <><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/><path d="M8 15h2v2h-2z"/></>,
    audit: <><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-4"/><path d="M5 14m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M7.5 16.5l2.5 2.5"/></>,
    briefcase: <><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"/><path d="M12 12l0 .01"/><path d="M3 13a20 20 0 0 0 18 0"/></>,
    onboard: <><path d="M9 10a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"/><path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18"/><path d="M16 11l2 2l4 -4"/></>,
    dealRoom: <><path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 6 0v-12a3 3 0 0 0 -3 -3z"/><path d="M6 8a3 3 0 1 0 0 6"/><path d="M18 8a3 3 0 1 1 0 6"/></>,
    panelLeft: <><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M9 4v16"/></>,
    menu: <><path d="M4 6l16 0"/><path d="M4 12l16 0"/><path d="M4 18l16 0"/></>,
    paperclip: <><path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"/></>,
    expand: <><path d="M4 8v-2a2 2 0 0 1 2 -2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2 -2v-2"/></>,
    minimize: <><path d="M5 12l14 0"/></>,
    file: <><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/></>,
    info: <><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/></>,
    calendar: <><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M16 3l0 4"/><path d="M8 3l0 4"/><path d="M4 11l16 0"/><path d="M11 15l1 0"/><path d="M12 15l0 3"/></>,
    trash: <><path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={style}>
      {paths[name] || null}
    </svg>
  );
};

// ────────────── Orb (gradient account icon) ──────────────
const Orb = ({ seed = 0, size = 28, style }) => {
  const palettes = [
    ["#8E7CFF", "#4B3FAB"], // iris
    ["#6AE1FF", "#2C6F8F"], // cyan
    ["#FF9D6A", "#9D4A2A"], // orange
    ["#8BDE9A", "#2E6B41"], // green
    ["#FF7DB8", "#8A2D5E"], // pink
    ["#FFD56A", "#8F6A15"], // amber
    ["#A89BFF", "#5C4FBE"], // violet
    ["#7BE0D3", "#2A6F6A"], // teal
  ];
  const [a, b] = palettes[seed % palettes.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      flexShrink: 0,
      background: `radial-gradient(circle at 30% 25%, ${a} 0%, ${b} 55%, #0B0B10 100%)`,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      ...style,
    }} />
  );
};

// ────────────── Avatar ──────────────
const Avatar = ({ name, size = 26, seed = 0 }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  const palettes = [
    ["#8E7CFF", "#4B3FAB"], ["#6AE1FF", "#2C6F8F"], ["#FF9D6A", "#9D4A2A"],
    ["#8BDE9A", "#2E6B41"], ["#FF7DB8", "#8A2D5E"], ["#FFD56A", "#8F6A15"],
  ];
  const idx = seed || name.charCodeAt(0);
  const [a, b] = palettes[idx % palettes.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 600,
      flexShrink: 0,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
    }}>{initials}</div>
  );
};

// ────────────── Full "Zive" wordmark (uploaded Union.svg) ──────────────
const ZiveWordmark = ({ height = 18, color = "currentColor" }) => (
  <svg height={height} viewBox="0 0 683 284" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M240.922 65.0436C258.683 62.1471 270.744 45.3344 267.861 27.4916C264.978 9.64816 248.242 -2.46861 230.481 0.427832C212.721 3.32427 200.66 20.137 203.543 37.9799C206.426 55.8233 223.161 67.94 240.922 65.0436Z"/>
    <path d="M111.56 192.573C126.384 169.224 139.199 149.051 161.833 139.291L177.076 132.728V82.433H2.99457V133.002H91.3962C83.0555 143.481 76.0236 154.536 69.3505 165.028L69.3382 165.046L69.1174 165.395L69.0867 165.442C53.5229 189.95 40.0806 211.112 14.6988 222.779L0 229.532V279.469H177.893V228.901H86.2035C96.003 217.016 103.981 204.458 111.518 192.573H111.56Z"/>
    <path d="M194.665 132.98H222.053V279.448H272.368V82.433H194.665V132.98Z"/>
    <path d="M395.235 228.88L442.199 82.433H495.069L431.877 279.448H347.662L285.328 82.433H338.136L384.472 228.88H395.235Z"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M538.37 195.245C543.73 216.679 559.476 234.791 584.414 236.431L584.434 236.452C597.417 235.99 608.703 229.763 617.099 220.55H675.035C654.684 269.814 598.464 299.979 544.881 275.094C466.509 238.304 466.509 120.381 544.881 83.6111C612.241 52.3321 683.85 107.991 682.992 179.342C683.055 184.748 682.657 190.049 681.924 195.245H538.37ZM630.437 161.525C622.479 133.422 594.422 112.261 564.857 127.028C550.891 134.474 542.244 147.263 538.496 161.525H630.437Z"/>
  </svg>
);

// ────────────── Brand mark (Z square) ──────────────
const ZMark = ({ size = 22, radius = 6 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block", flexShrink: 0 }}>
    <rect width="64" height="64" rx={radius * (64 / size)} fill="#615FFF"/>
    <path d="M35.8135 34.0054C38.3135 29.9764 40.4746 26.4955 44.2917 24.8113L46.8622 23.6788V15H17.505V23.726H32.4131C31.0065 25.5342 29.8207 27.4419 28.6953 29.2524L28.6932 29.2555L28.656 29.3158L28.6508 29.3239C26.0261 33.5528 23.7592 37.2046 19.4788 39.2178L17 40.3829V49H47V40.274H31.5374C33.19 38.2232 34.5354 36.0563 35.8064 34.0054H35.8135Z" fill="#FAFAFA"/>
  </svg>
);

// "ive" wordmark used after the Z square to spell Zive
const IveWordmark = ({ height = 14, color = "currentColor" }) => (
  <svg height={height} viewBox="0 0 34 24" fill="none" style={{ display: "block" }}>
    <path d="M2.9316 6.58053C4.1798 6.37656 5.0274 5.19257 4.8248 3.93603C4.6222 2.67945 3.446 1.82615 2.1978 2.03013C0.9496 2.2341 0.102 3.4181 0.3046 4.67464C0.5072 5.93122 1.6834 6.78451 2.9316 6.58053Z" fill={color}/>
    <path d="M-0.3193 11.3648H1.6055V21.6794H5.1415V7.80514H-0.3193V11.3648Z" fill={color}/>
    <path d="M13.7764 18.1183L17.077 7.80514H20.7925L16.3515 21.6794H10.4331L6.0524 7.80514H9.7636L13.02 18.1183H13.7764Z" fill={color}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M23.8357 15.7496C24.2124 17.2591 25.319 18.5345 27.0716 18.6501L27.073 18.6516C27.9854 18.619 28.7785 18.1805 29.3686 17.5317H33.4402C32.01 21.001 28.0589 23.1253 24.2933 21.3728C18.7854 18.7819 18.7854 10.4775 24.2933 7.88811C29.0272 5.68536 34.0597 9.605 33.9995 14.6297C34.0038 15.0104 33.9759 15.3837 33.9244 15.7496H23.8357ZM30.3059 13.375C29.7467 11.3959 27.7749 9.9057 25.6971 10.9456C24.7156 11.47 24.1079 12.3707 23.8445 13.375H30.3059Z" fill={color}/>
  </svg>
);

// ────────────── Logo ──────────────
const ZiveLogo = ({ size = 24 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <ZMark size={size} radius={5} />
    <IveWordmark height={size * 0.62} color="var(--fg)" />
  </div>
);

// ────────────── Display number with superscript cents ──────────────
const BigNum = ({ value, size = 40, color = "var(--fg)", weight = 420, prefix = "$" }) => {
  const [whole, cents = "00"] = String(value).split(".");
  return (
    <span className="display-num" style={{ fontSize: size, color, fontWeight: weight, lineHeight: 1 }}>
      {prefix}{whole}<span className="cents">.{cents}</span>
    </span>
  );
};

// ────────────── Pill ──────────────
const Pill = ({ children, tone = "neutral", icon, style }) => {
  const tones = {
    neutral: { bg: "var(--chip)", fg: "var(--muted)", ring: "transparent" },
    accent: { bg: "var(--accent-tint)", fg: "var(--accent-text)", ring: "transparent" },
    pos: { bg: "var(--pos-tint)", fg: "var(--pos)", ring: "transparent" },
    neg: { bg: "var(--neg-tint)", fg: "var(--neg)", ring: "transparent" },
    warn: { bg: "var(--warn-tint)", fg: "var(--warn)", ring: "transparent" },
    outline: { bg: "transparent", fg: "var(--muted)", ring: "var(--border-strong)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 8px", borderRadius: 999,
      background: t.bg, color: t.fg,
      fontSize: 11, fontWeight: 500, letterSpacing: 0,
      boxShadow: t.ring !== "transparent" ? `inset 0 0 0 1px ${t.ring}` : undefined,
      ...style,
    }}>
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  );
};

// ────────────── Button ──────────────
// Design tokens lifted from the supplied Button SVG kit:
//   - sizes: mini 20 / sm 24 / md 28 / lg 32 / xl 40 / 2xl 48
//   - radius = min(height * 0.4, 16)
//   - "filled" style → #52525C bg, white fg, 80% icon opacity, subtle 1px inset
//     stroke at rgba(113,113,123,0.15)
//   - "faded" style → rgba(113,113,123,0.10) bg, fg #52525C, icons #9F9FA9,
//     same 1px inset stroke
//   - "transparent" style → no bg, same fg/icon palette as faded
// Variant names from the existing API are mapped onto these:
//   primary → accent-tinted filled
//   solid   → faded (chip-style)
//   ghost   → faded (the default)
//   text    → transparent
//   pill    → faded, accent when active
const Button = ({ children, variant = "ghost", icon, iconRight, onClick, style, active, size = "md" }) => {
  // Inset stroke that mirrors the SVG's #71717B / 15% mask outline
  const insetStroke = "inset 0 0 0 1px var(--border-strong)";

  const variants = {
    primary: {
      bg: "var(--accent)", fg: "#fff",
      iconOpacity: 0.85,
      ring: "inset 0 0 0 1px rgba(255,255,255,0.14), 0 1px 0 rgba(255,255,255,0.18) inset",
      hoverBg: "var(--accent-hover)",
    },
    // Filled neutral, matches "Style=Filled" SVG
    filled: {
      bg: "var(--filled-btn-bg, #52525C)", fg: "#fff",
      iconOpacity: 0.8,
      ring: insetStroke,
      hoverBg: "var(--filled-btn-bg-hover, #5F5F69)",
    },
    // Faded neutral, matches "Style=Faded" SVG
    ghost: {
      bg: "var(--chip)", fg: "var(--fg-2)",
      iconOpacity: 1,
      ring: insetStroke,
      hoverBg: "var(--chip-hover)",
    },
    solid: {
      bg: "var(--chip)", fg: "var(--fg-2)",
      iconOpacity: 1,
      ring: insetStroke,
      hoverBg: "var(--chip-hover)",
    },
    // Transparent, matches "Style=Transparent" SVG
    text: {
      bg: "transparent", fg: "var(--muted)",
      iconOpacity: 1,
      ring: "none",
      hoverBg: "var(--chip)",
    },
    pill: {
      bg: active ? "var(--accent-tint)" : "var(--chip)",
      fg: active ? "var(--accent-text)" : "var(--fg-2)",
      iconOpacity: 1,
      ring: active ? "inset 0 0 0 1px var(--accent-ring-30)" : insetStroke,
      hoverBg: active ? "var(--accent-tint-2)" : "var(--chip-hover)",
    },
  };
  const v = variants[variant] || variants.ghost;

  // Heights + paddings + font sizes scaled from the SVG kit.
  // Padding-x ≈ height * 0.375, gap = padding-x * 0.5, icon-only = square.
  const sizes = {
    mini: { h: 20, padX: 8,  gap: 5, fs: 11, iconSz: 12 },
    sm:   { h: 24, padX: 10, gap: 6, fs: 12, iconSz: 13 },
    md:   { h: 28, padX: 11, gap: 6, fs: 12, iconSz: 14 },
    lg:   { h: 32, padX: 12, gap: 7, fs: 13, iconSz: 14 },
    xl:   { h: 40, padX: 16, gap: 8, fs: 14, iconSz: 16 },
    "2xl":{ h: 48, padX: 20, gap: 9, fs: 15, iconSz: 18 },
  };
  const s = sizes[size] || sizes.md;
  const radius = Math.min(s.h * 0.4, 16);
  const iconOnly = !children && (icon || iconRight);
  const padding = iconOnly ? "0" : `0 ${s.padX}px`;
  const dim = iconOnly ? { width: s.h } : null;

  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: s.gap, justifyContent: "center",
      padding, height: s.h, borderRadius: radius,
      background: v.bg, color: v.fg,
      boxShadow: v.ring,
      fontSize: s.fs, fontWeight: 500, letterSpacing: -0.1,
      transition: "all 100ms ease",
      whiteSpace: "nowrap",
      ...dim,
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = v.hoverBg; }}
      onMouseLeave={e => { e.currentTarget.style.background = v.bg; }}
    >
      {icon && (
        <span style={{ display: "inline-flex", opacity: v.iconOpacity }}>
          <Icon name={icon} size={s.iconSz} />
        </span>
      )}
      {children}
      {iconRight && (
        <span style={{ display: "inline-flex", opacity: v.iconOpacity }}>
          <Icon name={iconRight} size={s.iconSz} />
        </span>
      )}
    </button>
  );
};

// ────────────── Card ──────────────
const Card = ({ children, style, padding = 20, hero, onClick }) => (
  <div
    className={hero ? "hero-card" : ""}
    onClick={onClick}
    style={{
      background: "var(--surface)",
      borderRadius: "var(--r-lg)",
      boxShadow: "inset 0 0 0 1px var(--border)",
      padding,
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>
    {children}
  </div>
);

// ────────────── Sidebar ──────────────
const NavItem = ({ icon, label, active, onClick, hint, hintTone, indent = 0, dot, collapsed, iconRight, submenu, onSubmenuPick, activeSubId }) => {
  const [hover, setHover] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const triggerRef = React.useRef(null);
  const closeTimer = React.useRef(null);
  const open = submenu && hover;
  const openSub = () => {
    clearTimeout(closeTimer.current);
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const panelW = 260;
      let left = r.right + 8;
      if (left + panelW > window.innerWidth - 8) left = Math.max(8, window.innerWidth - panelW - 8);
      const top = Math.max(8, Math.min(r.top - 6, window.innerHeight - 320));
      setPos({ top, left });
    }
    setHover(true);
  };
  const scheduleClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setHover(false), 120); };
  const hintStyles = {
    danger: { bg: "var(--neg)", fg: "#fff", bw: "transparent" },
    warn: { bg: "var(--warn-tint)", fg: "var(--warn)", bw: "rgba(245,158,11,0.25)" },
    accent: { bg: "var(--accent-tint)", fg: "var(--accent)", bw: "var(--accent-ring-30)" },
    beta: { bg: "rgba(96, 165, 250, 0.14)", fg: "#93C5FD", bw: "rgba(96,165,250,0.3)" },
    neutral: { bg: "var(--hover-bg)", fg: "var(--muted-2)", bw: "transparent" },
  };
  const h = hintStyles[hintTone] || hintStyles.neutral;

  if (collapsed) {
    return (
      <button onClick={onClick} title={label} style={{
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, margin: "1px auto",
        borderRadius: 8,
        background: active ? "var(--hover-bg)" : "transparent",
        color: active ? "var(--fg)" : "var(--muted-2)",
        border: "none",
        cursor: "pointer",
        transition: "all 120ms ease",
        boxShadow: active ? "inset 0 0 0 1px var(--border)" : "none",
      }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.background = "var(--hover-bg-soft)"; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "var(--muted-2)"; e.currentTarget.style.background = "transparent"; } }}
      >
        {icon && <Icon name={icon} size={17} color="currentColor" />}
        {hint && hintTone === "danger" && (
          <span className="num" style={{
            position: "absolute", top: -2, right: -2,
            minWidth: 16, height: 16, padding: "0 4px",
            borderRadius: 999,
            background: "var(--neg)", color: "#fff",
            fontSize: 9.5, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--bg)",
            lineHeight: 1,
          }}>{hint}</span>
        )}
      </button>
    );
  }

  return (
    <div ref={triggerRef} style={{ position: "relative" }}
      onMouseEnter={openSub} onMouseLeave={scheduleClose}>
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "6px 10px", paddingLeft: 10 + indent,
      borderRadius: 7, minHeight: 30,
      background: active || open ? "var(--hover-bg)" : "transparent",
      color: active || open ? "var(--fg)" : "var(--muted)",
      fontSize: 13, fontWeight: active ? 500 : 450,
      textAlign: "left", transition: "all 100ms ease",
      boxShadow: active || open ? "inset 0 0 0 1px var(--border)" : "none",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--fg)"; }}
      onMouseLeave={e => { if (!active && !open) e.currentTarget.style.color = "var(--muted)"; }}
    >
      {icon && <Icon name={icon} size={15} color={active ? "var(--fg)" : "var(--muted-2)"} />}
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: dot, flexShrink: 0, marginRight: -2,
        }} />
      )}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      {hint && (
        <span className="num" style={{
          fontSize: hintTone === "danger" ? 10.5 : 11,
          fontWeight: hintTone === "danger" ? 700 : 600,
          color: h.fg,
          padding: hintTone === "danger" ? "1px 6px" : "1px 6px",
          borderRadius: hintTone === "danger" ? 999 : 4,
          background: h.bg,
          boxShadow: h.bw !== "transparent" ? `inset 0 0 0 1px ${h.bw}` : "none",
          letterSpacing: hintTone === "beta" ? 0.5 : 0,
          textTransform: hintTone === "beta" ? "uppercase" : "none",
        }}>{hint}</span>
      )}
      {iconRight && <Icon name={iconRight} size={12} color="var(--muted-3)" />}
    </button>
    {open && pos && ReactDOM.createPortal((
      <div onMouseEnter={openSub} onMouseLeave={scheduleClose} style={{
        position: "fixed",
        top: pos.top, left: pos.left,
        zIndex: 9999,
        minWidth: 240,
        padding: 6,
        background: "var(--elevated)",
        borderRadius: 10,
        boxShadow: "var(--shadow-pop)",
        border: "1px solid var(--border-strong)",
      }}>
        <div style={{
          padding: "6px 10px 8px",
          fontSize: 10.5, color: "var(--muted-3)",
          fontWeight: 500, letterSpacing: 0.6, textTransform: "uppercase",
        }}>{label} pages</div>
        {submenu.map(s => {
          const isActiveSub = s.id === activeSubId;
          return (
            <button key={s.id} onClick={() => { onSubmenuPick && onSubmenuPick(s.id); setHover(false); }}
              onMouseEnter={e => { if (!isActiveSub) { e.currentTarget.style.background = "var(--hover-bg)"; e.currentTarget.style.color = "var(--fg)"; } }}
              onMouseLeave={e => { if (!isActiveSub) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; } }}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "7px 10px", borderRadius: 7,
                background: isActiveSub ? "var(--active-bg)" : "transparent",
                color: isActiveSub ? "var(--fg)" : "var(--muted)",
                border: "none", cursor: "pointer",
                fontSize: 12.5, fontFamily: "inherit", textAlign: "left",
                fontWeight: isActiveSub ? 500 : 450,
                boxShadow: isActiveSub ? "inset 0 0 0 1px var(--border)" : "none",
                transition: "all 100ms ease",
              }}>
              <span style={{ flex: 1 }}>{s.label}</span>
              {isActiveSub && <Icon name="check" size={11} color="var(--accent)" />}
            </button>
          );
        })}
      </div>
    ), document.body)}
    </div>
  );
};

const SidebarSection = ({ label, children, action, collapsed }) => (
  <div style={{ marginBottom: collapsed ? 8 : 14 }}>
    {label && !collapsed && (
      <div style={{
        padding: "8px 12px 4px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted-3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
        {action}
      </div>
    )}
    {collapsed && label && (
      <div style={{
        margin: "6px auto 4px",
        height: 1, width: 20, background: "var(--border)",
      }} />
    )}
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>{children}</div>
  </div>
);

// ────────────── TopBar ──────────────
// ────────────── Entity / Fund switcher ──────────────
const ENTITY_LIST = {
  funds: [
    { id: "admin", name: "Admin Ventures / VCFO Admin", role: "ADMIN", kind: "VCFO", seed: 4 },
    { id: "admin-iv", name: "Admin Ventures IV", role: "ADMIN", kind: "FUND", seed: 0 },
    { id: "admin-v", name: "Admin Ventures V", role: "USER", kind: "FUND", seed: 1 },
  ],
  others: [],
};

const EntitySwitcher = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const all = [...ENTITY_LIST.funds, ...ENTITY_LIST.others];
  const current = all.find(e => e.id === value) || all[0];

  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        height: 40, padding: "0 14px 0 8px",
        background: open ? "var(--surface-2)" : "transparent",
        border: "1px solid",
        borderColor: open ? "var(--border-strong)" : "transparent",
        borderRadius: 10,
        cursor: "pointer", fontFamily: "inherit",
        transition: "background 120ms ease, border-color 120ms ease",
      }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "var(--surface)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <Orb seed={current.seed} size={28} />
        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--fg)", letterSpacing: -0.1 }}>{current.name}</div>
          <div style={{ fontSize: 10, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>
            {current.role}
          </div>
        </div>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: 48, left: 0, zIndex: 50,
          width: 360, background: "var(--elevated)",
          border: "1px solid var(--border-strong)", borderRadius: 12,
          boxShadow: "var(--shadow-pop)",
          padding: 8,
        }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            height: 38, padding: "0 12px", marginBottom: 6,
            background: "var(--surface-2)",
            borderRadius: 8,
            boxShadow: "inset 0 0 0 1px var(--border)",
          }}>
            <Icon name="building" size={13} color="var(--muted)" />
            <input placeholder="Search entities" style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", fontSize: 13, fontFamily: "inherit",
            }} />
            <Icon name="chevronD" size={11} color="var(--muted-2)" />
          </div>

          <SwitcherGroup label="Funds" items={ENTITY_LIST.funds} value={value} onPick={id => { onChange(id); setOpen(false); }} />

          <button style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "10px 12px",
            background: "transparent", border: "none",
            color: "var(--muted)", fontSize: 12.5, fontFamily: "inherit",
            cursor: "pointer", borderRadius: 7,
            marginTop: 4,
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            See All
            <Icon name="chevronR" size={11} color="var(--muted-2)" />
          </button>
        </div>
      )}
    </div>
  );
};

const SwitcherGroup = ({ label, items, value, onPick }) => {
  if (!items || items.length === 0) return null;
  return (
  <div style={{ marginBottom: 4 }}>
    <div style={{
      padding: "8px 12px 6px", fontSize: 11,
      color: "var(--muted-2)", fontWeight: 500,
      textTransform: "uppercase", letterSpacing: 0.5,
    }}>{label}</div>
    {items.map(it => (
      <button key={it.id} onClick={() => onPick(it.id)} style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "8px 12px",
        background: "transparent", border: "none",
        cursor: "pointer", fontFamily: "inherit",
        borderRadius: 7, textAlign: "left",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <span style={{ width: 14, display: "inline-flex", justifyContent: "center" }}>
          {value === it.id && <Icon name="check" size={12} color="var(--accent)" />}
        </span>
        <Orb seed={it.seed} size={26} />
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: value === it.id ? 500 : 450, color: "var(--fg)" }}>{it.name}</span>
        <span style={{
          fontSize: 10, padding: "2px 7px", borderRadius: 4,
          background: "var(--chip)", color: "var(--muted)",
          fontWeight: 500, letterSpacing: 0.4,
        }}>{it.role}</span>
      </button>
    ))}
  </div>
  );
};

// ────────────── Investment firm switcher (home-only) ──────────────
const INVESTMENT_FIRMS_LIST = [
  { id: "admin-ventures", name: "Admin Ventures" },
];

const InvestmentFirmSwitcher = ({ value = "admin-ventures", onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = INVESTMENT_FIRMS_LIST.find(f => f.id === value) || INVESTMENT_FIRMS_LIST[0];

  useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        height: 40, padding: "0 12px 0 10px",
        background: open ? "var(--surface-2)" : "transparent",
        border: "1px solid",
        borderColor: open ? "var(--border-strong)" : "transparent",
        borderRadius: 10,
        cursor: "pointer", fontFamily: "inherit",
        transition: "background 120ms ease, border-color 120ms ease",
      }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "var(--surface)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <Icon name="building" size={14} color="var(--muted)" />
        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
          <div style={{ fontSize: 10, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6 }}>
            Investment firm
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--fg)", letterSpacing: -0.1, marginTop: 1 }}>{current.name}</div>
        </div>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: 48, left: 0, zIndex: 50,
          width: 260, background: "var(--elevated)",
          border: "1px solid var(--border-strong)", borderRadius: 12,
          boxShadow: "var(--shadow-pop)",
          padding: 6,
        }}>
          <div style={{
            padding: "8px 12px 6px", fontSize: 11,
            color: "var(--muted-2)", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>Investment firm</div>
          {INVESTMENT_FIRMS_LIST.map(f => (
            <button key={f.id} onClick={() => { onChange && onChange(f.id); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "9px 12px",
              background: "transparent", border: "none",
              cursor: "pointer", fontFamily: "inherit",
              borderRadius: 7, textAlign: "left",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ width: 14, display: "inline-flex", justifyContent: "center" }}>
                {value === f.id && <Icon name="check" size={12} color="var(--accent)" />}
              </span>
              <Icon name="building" size={13} color="var(--muted)" />
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: value === f.id ? 500 : 450, color: "var(--fg)" }}>{f.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ────────────── TopBar ──────────────
const TopBar = ({ onAskAI, entity, onChangeEntity, mode }) => {
  // On Home, show only the Investment firm switcher (no entity dropdown, no ask, no bell, no avatar)
  if (mode === "home") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 56, padding: "0 16px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <InvestmentFirmSwitcher />
        <div style={{ flex: 1 }} />
      </div>
    );
  }

  // On Zive AI route: clean view — only the entity context, no ask button.
  if (mode === "zive-ai") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 56, padding: "0 16px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <EntitySwitcher value={entity} onChange={onChangeEntity} />
        <div style={{ flex: 1 }} />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      height: 56, padding: "0 16px",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg)",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      <EntitySwitcher value={entity} onChange={onChangeEntity} />
      <div style={{ flex: 1 }} />
      <button onClick={onAskAI} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        height: 34, padding: "0 14px",
        background: "linear-gradient(135deg, #7C5CFF 0%, #615FFF 50%, #4F46E5 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 999,
        cursor: "pointer", fontFamily: "inherit",
        color: "#FFFFFF", fontSize: 13, fontWeight: 500,
        boxShadow: "0 4px 14px rgba(97,95,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
        transition: "transform 120ms ease, box-shadow 120ms ease, filter 120ms ease",
      }}
        onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(97,95,255,0.5), inset 0 1px 0 rgba(255,255,255,0.22)"; }}
        onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(97,95,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
      >
        Ask
        <ZiveWordmark height={11} color="#FFFFFF" />
        <span className="num" style={{
          fontSize: 10.5, padding: "1px 5px",
          background: "rgba(255,255,255,0.18)", color: "#FFFFFF",
          borderRadius: 4, fontFamily: "var(--font-mono)",
          marginLeft: 2,
        }}>⌘K</span>
      </button>
      <Button variant="text" size="sm" icon="bell" />
      <Avatar name="Morgan Chen" size={30} seed={5} />
    </div>
  );
};

// ────────────── Sparkline ──────────────
const Sparkline = ({ data, w = 120, h = 36, color = "var(--accent)", fill = true }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 4) - 2,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const gid = `spg-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ────────────── AreaChart (big, interactive) ──────────────
// Parse "Apr'23" / "Apr 2023" / "Apr" → {m, y?}
const _MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function _parseMonthLabel(s) {
  if (!s) return null;
  const mm = String(s).match(/([A-Za-z]+)[^\d]*(\d{2,4})?/);
  if (!mm) return null;
  const mi = _MONTHS.indexOf(mm[1].slice(0,3));
  if (mi < 0) return null;
  let y = null;
  if (mm[2]) y = mm[2].length === 2 ? 2000 + parseInt(mm[2],10) : parseInt(mm[2],10);
  return { m: mi, y };
}
function _addMonths(m, y, k) {
  const total = m + k;
  const ny = y + Math.floor(total / 12);
  const nm = ((total % 12) + 12) % 12;
  return { m: nm, y: ny };
}
function _defaultFormatX(i, n, labels) {
  if (!labels || labels.length < 2) return `#${i+1}`;
  const first = _parseMonthLabel(labels[0]);
  const last  = _parseMonthLabel(labels[labels.length-1]);
  if (!first || !last || first.y == null || last.y == null) {
    // Fallback: pick nearest label
    const f = i / (n - 1);
    return labels[Math.round(f * (labels.length - 1))];
  }
  const totalMonths = (last.y - first.y) * 12 + (last.m - first.m);
  const stepMonths = totalMonths / (n - 1);
  const k = Math.round(i * stepMonths);
  const at = _addMonths(first.m, first.y, k);
  return `${_MONTHS[at.m]} ${String(at.y).slice(-2)}`;
}

const AreaChart = ({
  data, w = 600, h = 200, color = "var(--accent)", highlightX, labels,
  formatX, formatY,
}) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pad = 24;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    pad + (1 - (v - min) / range) * (h - pad * 2),
  ]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  const gid = useMemo(() => `ac-${Math.random().toString(36).slice(2, 8)}`, []);

  const defaultIdx = highlightX != null ? Math.round(highlightX * (data.length - 1)) : null;
  const [hoverIdx, setHoverIdx] = useState(null);
  const wrapRef = useRef(null);

  const fmtX = formatX || ((i) => _defaultFormatX(i, data.length, labels));
  const fmtY = formatY || ((v) => v.toFixed(2));

  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    const t = (x - pad) / (w - pad * 2);
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(t * (data.length - 1))));
    setHoverIdx(idx);
  };
  const onLeave = () => setHoverIdx(null);

  const activeIdx = hoverIdx != null ? hoverIdx : defaultIdx;
  const activePt = activeIdx != null ? pts[activeIdx] : null;
  const activeVal = activeIdx != null ? data[activeIdx] : null;

  // Tooltip positioning in CSS percentages so it follows responsively
  const tipLeftPct = activePt ? (activePt[0] / w) * 100 : 0;
  const tipTopPct = activePt ? (activePt[1] / h) * 100 : 0;

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: h }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* baseline grid */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)}
            stroke="rgba(127,127,127,0.12)" strokeDasharray="2 4"/>
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        {activePt && (
          <g style={{ pointerEvents: "none" }}>
            <line x1={activePt[0]} x2={activePt[0]} y1={pad} y2={h - pad} stroke="rgba(127,127,127,0.45)" strokeDasharray="2 3"/>
            <circle cx={activePt[0]} cy={activePt[1]} r="5.5" fill={color} fillOpacity="0.18"/>
            <circle cx={activePt[0]} cy={activePt[1]} r="4" fill={color} stroke="var(--bg)" strokeWidth="2"/>
          </g>
        )}
        {labels && labels.map((lab, i) => {
          const x = pad + (i / (labels.length - 1)) * (w - pad * 2);
          return <text key={i} x={x} y={h - 6} textAnchor="middle" fontSize="10" fill="var(--muted-2)">{lab}</text>;
        })}
      </svg>
      {activePt && (
        <div style={{
          position: "absolute",
          left: `${tipLeftPct}%`,
          top: `${tipTopPct}%`,
          transform: `translate(${tipLeftPct > 70 ? "calc(-100% - 14px)" : "14px"}, calc(-100% - 8px))`,
          pointerEvents: "none",
          background: "var(--surface-2, #1b1f25)",
          border: "1px solid var(--border-strong, rgba(255,255,255,0.12))",
          borderRadius: 8,
          padding: "8px 10px",
          minWidth: 110,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          fontSize: 11,
          color: "var(--fg, #fff)",
          whiteSpace: "nowrap",
          zIndex: 5,
        }}>
          <div style={{ fontSize: 10, color: "var(--muted-2)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {fmtX(activeIdx)}
          </div>
          <div className="num" style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
            {fmtY(activeVal)}
          </div>
        </div>
      )}
    </div>
  );
};

// ────────────── Donut (interactive) ──────────────
const Donut = ({ segments, size = 48, thickness = 8, interactive = true, onHover }) => {
  const r = (size - thickness) / 2;
  const rOuter = r + thickness / 2;
  const rInner = r - thickness / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  const [hoverIdx, setHoverIdx] = useState(null);

  // Pre-compute segment angle ranges (in radians, starting at top, clockwise)
  let acc = 0;
  const ranges = segments.map(s => {
    const start = acc;
    const len = (s.value / total) * Math.PI * 2;
    acc += len;
    return { start, end: start + len };
  });

  // Build pie wedge paths for hit-testing
  const polar = (cx, cy, rad, angle) => {
    // angle 0 = top, growing clockwise
    const a = angle - Math.PI / 2;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  const wedgePath = (i) => {
    const cx = size / 2, cy = size / 2;
    const { start, end } = ranges[i];
    const large = end - start > Math.PI ? 1 : 0;
    const [x1, y1] = polar(cx, cy, rOuter, start);
    const [x2, y2] = polar(cx, cy, rOuter, end);
    const [x3, y3] = polar(cx, cy, rInner, end);
    const [x4, y4] = polar(cx, cy, rInner, start);
    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
  };

  let offset = 0;
  const active = hoverIdx != null ? segments[hoverIdx] : null;
  const pct = active ? ((active.value / total) * 100) : null;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness}/>
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const isHover = hoverIdx === i;
          const dim = hoverIdx != null && !isHover;
          const el = (
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={s.color} strokeWidth={isHover ? thickness + 2 : thickness}
              strokeOpacity={dim ? 0.35 : 1}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size/2} ${size/2})`}
              strokeLinecap="butt"
              style={{ transition: "stroke-width 120ms ease, stroke-opacity 120ms ease" }}
            />
          );
          offset += len;
          return el;
        })}
        {/* Invisible hit-test wedges on top */}
        {interactive && segments.map((s, i) => (
          <path key={`hit-${i}`} d={wedgePath(i)} fill="rgba(0,0,0,0)"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => { setHoverIdx(i); onHover && onHover(i); }}
            onMouseLeave={() => { setHoverIdx(null); onHover && onHover(null); }}
          />
        ))}
        {/* Center label on hover */}
        {active && (
          <g style={{ pointerEvents: "none" }}>
            <text x={size/2} y={size/2 - 2} textAnchor="middle"
              fontSize={Math.max(10, size * 0.13)} fontWeight="600" fill="var(--fg)">
              {pct.toFixed(0)}%
            </text>
            <text x={size/2} y={size/2 + Math.max(10, size * 0.13)} textAnchor="middle"
              fontSize={Math.max(8, size * 0.085)} fill="var(--muted-2)">
              {active.name}
            </text>
          </g>
        )}
      </svg>
      {active && (
        <div style={{
          position: "absolute",
          left: "50%", top: -8,
          transform: "translate(-50%, -100%)",
          background: "var(--surface-2, #1b1f25)",
          border: "1px solid var(--border-strong, rgba(255,255,255,0.12))",
          borderRadius: 8,
          padding: "6px 10px",
          fontSize: 11,
          color: "var(--fg, #fff)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", gap: 8,
          zIndex: 5,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: active.color, display: "inline-block" }} />
          <span style={{ fontWeight: 500 }}>{active.name}</span>
          <span className="num" style={{ color: "var(--muted)" }}>{pct.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

// ────────────── Progress bar ──────────────
const Progress = ({ value, max = 100, segments, height = 4, color = "var(--accent)" }) => (
  <div style={{ width: "100%", height, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden", display: "flex" }}>
    {segments
      ? segments.map((s, i) => (
          <div key={i} style={{ width: `${(s.value / max) * 100}%`, background: s.color, height: "100%" }} />
        ))
      : <div style={{ width: `${(value / max) * 100}%`, background: color, height: "100%" }} />}
  </div>
);

// ────────────── ColumnsMenu — toggle + drag-to-reorder ──────────────
// Props:
//   columns: [{ key: "id", label: "Display name" }] — full column catalog
//   order:   ["id1", "id2", ...]     — current order, including hidden
//   visible: { id1: true, id2: false, ... }
//   onChange: ({ order, visible }) => void
function ColumnsMenu({ columns, order, visible, onChange, alignRight = true, label = "Columns" }) {
  const [open, setOpen] = useState(false);
  const [dragKey, setDragKey] = useState(null);
  const [dropKey, setDropKey] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const labelMap = Object.fromEntries(columns.map(c => [c.key, c.label]));
  const orderedItems = order.filter(k => labelMap[k]);

  const allOn = orderedItems.every(k => visible[k]);
  const setAll = (val) => onChange({ order, visible: Object.fromEntries(orderedItems.map(k => [k, val])) });
  const reset = () => onChange({
    order: columns.map(c => c.key),
    visible: Object.fromEntries(columns.map(c => [c.key, true])),
  });

  const onDragStart = (k) => (e) => { setDragKey(k); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", k); } catch {} };
  const onDragOver = (k) => (e) => { e.preventDefault(); if (k !== dropKey) setDropKey(k); };
  const onDragEnd = () => { setDragKey(null); setDropKey(null); };
  const onDrop = (k) => (e) => {
    e.preventDefault();
    if (!dragKey || dragKey === k) return onDragEnd();
    const next = orderedItems.filter(x => x !== dragKey);
    const idx = next.indexOf(k);
    next.splice(idx, 0, dragKey);
    onChange({ order: next, visible });
    onDragEnd();
  };

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 28, padding: "0 12px",
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 7, color: "var(--fg-2)",
        fontSize: 12, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit",
      }}>
        <Icon name="list" size={12} /> {label}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 34, [alignRight ? "right" : "left"]: 0, zIndex: 50,
          width: 240, background: "var(--elevated)",
          border: "1px solid var(--border-strong)", borderRadius: 10,
          boxShadow: "var(--shadow-pop)", padding: 6,
          maxHeight: 420, overflowY: "auto",
        }}>
          <div style={{ padding: "8px 10px 6px", fontSize: 12, color: "var(--fg)", fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Column Visibility</span>
            <span style={{ fontSize: 10.5, color: "var(--muted-3)", fontWeight: 400 }}>Drag to reorder</span>
          </div>
          <button onClick={() => setAll(!allOn)} style={colMenuBtn}>
            <span style={{ width: 14, display: "inline-flex" }}>{allOn && <Icon name="check" size={11} color="var(--accent)" />}</span>
            {allOn ? "Hide all" : "Show all"}
          </button>
          <button onClick={reset} style={colMenuBtn}>
            <span style={{ width: 14, display: "inline-flex" }}><Icon name="transfer" size={11} color="var(--muted)" /></span>
            Reset to default
          </button>
          <div style={{ height: 1, background: "var(--border)", margin: "4px 4px" }} />
          {orderedItems.map(k => {
            const isDragging = dragKey === k;
            const isDropTarget = dropKey === k && dragKey && dragKey !== k;
            return (
              <div
                key={k}
                draggable
                onDragStart={onDragStart(k)}
                onDragOver={onDragOver(k)}
                onDrop={onDrop(k)}
                onDragEnd={onDragEnd}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: isDragging ? "var(--accent-ring-10)" : (isDropTarget ? "var(--accent-ring-06)" : "transparent"),
                  borderTop: isDropTarget ? "1px solid var(--accent)" : "1px solid transparent",
                  cursor: "grab",
                  opacity: isDragging ? 0.55 : 1,
                  transition: "background 100ms ease",
                }}
                onMouseEnter={e => { if (!isDragging) e.currentTarget.style.background = "var(--surface)"; }}
                onMouseLeave={e => { if (!isDragging && !isDropTarget) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ color: "var(--muted-3)", display: "inline-flex", cursor: "grab" }} title="Drag to reorder">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="2" cy="2" r="1.2"/><circle cx="2" cy="7" r="1.2"/><circle cx="2" cy="12" r="1.2"/><circle cx="8" cy="2" r="1.2"/><circle cx="8" cy="7" r="1.2"/><circle cx="8" cy="12" r="1.2"/></svg>
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onChange({ order, visible: { ...visible, [k]: !visible[k] } }); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    flex: 1, padding: 0,
                    background: "transparent", border: "none",
                    color: "var(--fg-2)", fontSize: 12.5, fontWeight: 400,
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  }}
                >
                  <span style={{
                    width: 14, height: 14, borderRadius: 3,
                    border: "1px solid " + (visible[k] ? "var(--accent)" : "var(--border-strong)"),
                    background: visible[k] ? "var(--accent)" : "transparent",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {visible[k] && <Icon name="check" size={9} color="#fff" />}
                  </span>
                  {labelMap[k]}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const colMenuBtn = {
  display: "flex", alignItems: "center", gap: 8,
  width: "100%", padding: "8px 10px",
  background: "transparent", border: "none",
  color: "var(--fg-2)", fontSize: 12.5,
  cursor: "pointer", fontFamily: "inherit",
  borderRadius: 6, textAlign: "left",
};

// ────────────── Sort header ──────────────
// Click to cycle: none → asc → desc → none
// Inactive: both arrows muted. Active: arrow for direction is bright, other is dim.
function SortHeader({ children, dir = null, onClick, align = "left", style }) {
  const justify = align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        justifyContent: justify, width: "100%",
        padding: 0, margin: 0,
        background: "transparent", border: "none",
        color: "inherit", font: "inherit",
        cursor: "pointer", textAlign: align,
        ...style,
      }}
    >
      {align === "right" && <SortIcon dir={dir} />}
      <span>{children}</span>
      {align !== "right" && <SortIcon dir={dir} />}
    </button>
  );
}

function SortIcon({ dir }) {
  const upActive = dir === "asc";
  const downActive = dir === "desc";
  const dim = "var(--muted-3)";
  const bright = "var(--fg)";
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0, gap: 1, opacity: 0.85 }}>
      <svg width="8" height="5" viewBox="0 0 8 5" style={{ display: "block" }}>
        <path d="M0.5 4.5L4 1L7.5 4.5" stroke={upActive ? bright : (dir ? dim : "var(--muted-2)")} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg width="8" height="5" viewBox="0 0 8 5" style={{ display: "block" }}>
        <path d="M0.5 0.5L4 4L7.5 0.5" stroke={downActive ? bright : (dir ? dim : "var(--muted-2)")} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// Helper: cycle a sort state given a column key
// state: { key: string|null, dir: "asc"|"desc"|null }
function cycleSort(state, key) {
  if (state.key !== key) return { key, dir: "asc" };
  if (state.dir === "asc") return { key, dir: "desc" };
  return { key: null, dir: null };
}

// Helper: sort an array of rows by a column key.
// rows is an array of objects with `vals` keyed by column.
// For Tasks-style flat objects, pass `getter` to extract value.
function sortRows(rows, sortState, getter) {
  if (!sortState || !sortState.key || !sortState.dir) return rows;
  const k = sortState.key;
  const dir = sortState.dir === "asc" ? 1 : -1;
  const get = getter || ((row, key) => row.vals ? row.vals[key] : row[key]);
  // Don't sort across header rows; partition them and sort body rows only
  const out = [...rows];
  out.sort((a, b) => {
    if (a.header && b.header) return 0;
    if (a.header) return -1;
    if (b.header) return 1;
    const va = get(a, k);
    const vb = get(b, k);
    const na = parseSortable(va);
    const nb = parseSortable(vb);
    if (na !== null && nb !== null) return (na - nb) * dir;
    return String(va || "").localeCompare(String(vb || "")) * dir;
  });
  return out;
}

function parseSortable(v) {
  if (v == null || v === "" || v === "—") return null;
  if (typeof v === "number") return v;
  // strip $ , % x and spaces
  const cleaned = String(v).replace(/[$,%xX\s]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

Object.assign(window, {
  Icon, Orb, Avatar, ZiveLogo, ZMark, IveWordmark, ZiveWordmark, BigNum, Pill, Button, Card,
  NavItem, SidebarSection, Sparkline, AreaChart, Donut, Progress, TopBar,
  ENTITY_LIST, ColumnsMenu, SortHeader, SortIcon, cycleSort, sortRows,
});
