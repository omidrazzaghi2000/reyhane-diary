/* Icons (Lucide-style, 24px, stroke 2), mood faces, weather, stickers, mascot, sakura tree */
(function () {
  const S = (inner, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;
  const icons = {
    home: S('<path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z"/>'),
    pen: S('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    book: S('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    abc: S('<path d="M4 20V8a4 4 0 0 1 8 0v12"/><path d="M4 14h8"/><path d="M16 4h3a3 3 0 0 1 0 6h-3a3 3 0 0 0 0 6h3"/>'),
    settings: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    search: S('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
    calendar: S('<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    list: S('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
    star: S('<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'),
    heart: S('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .9-4.5 2.5C10.5 3.9 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>'),
    heartFill: S('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .9-4.5 2.5C10.5 3.9 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" fill="currentColor"/>'),
    trash: S('<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>'),
    edit: S('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>'),
    chevronLeft: S('<path d="m15 18-6-6 6-6"/>'),
    chevronRight: S('<path d="m9 18 6-6-6-6"/>'),
    upload: S('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>'),
    download: S('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>'),
    cloud: S('<path d="M17.5 19a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 12.6 3.5 3.5 0 0 0 6 19z"/>'),
    cloudUp: S('<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="m12 12 4 4m-4-4-4 4m4-4v9"/>'),
    cloudDown: S('<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="m12 21 4-4m-4 4-4-4m4 4v-9"/>'),
    check: S('<path d="M20 6 9 17l-5-5"/>'),
    x: S('<path d="M18 6 6 18M6 6l12 12"/>'),
    plus: S('<path d="M12 5v14M5 12h14"/>'),
    sparkles: S('<path d="m12 3 1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>'),
    refresh: S('<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>'),
    undo: S('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>'),
    flame: S('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.2-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.2-2.5 1-3.5a2.5 2.5 0 0 0 2.5 2.5z"/>'),
    type: S('<path d="M4 7V4h16v3M9 20h6M12 4v16"/>'),
    flower: S('<circle cx="12" cy="12" r="3"/><path d="M12 9a3 3 0 0 0 0-6 3 3 0 0 0 0 6M12 15a3 3 0 0 1 0 6 3 3 0 0 1 0-6M9 12a3 3 0 0 0-6 0 3 3 0 0 0 6 0M15 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0"/>'),
    badge: S('<path d="M12 2 15 8l6.5 1-4.8 4.6L18 20l-6-3.2L6 20l1.3-6.4L2.5 9 9 8z"/>'),
    wand: S('<path d="m15 4 1 1M4 15l1 1M17.5 8.5 20 11M6 4l1-1M10 3v1M3 10h1"/><path d="m2.5 21.5 14-14 2 2-14 14z"/>'),
    eraser: S('<path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 19"/><path d="M22 21H7M5 11l9 9"/>'),
    user: S('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    save: S('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'),
    alert: S('<path d="m10.3 3.9-8.5 14.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
    info: S('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
    eye: S('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: S('<path d="M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A16 16 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6"/><path d="m2 2 20 20"/><path d="M14.1 14.1a3 3 0 0 1-4.2-4.2"/>'),
    moon: S('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
    sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    clock: S('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    lock: S('<rect x="4" y="11" width="16" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/>'),
    unlock: S('<rect x="4" y="11" width="16" height="10" rx="3"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/>'),
    key: S('<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M15 8l3 3M18 5l3 3"/>'),
    smile: S('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'),
  };

  /* Mood faces — soft clay blobs */
  const face = (bg, mouth, eyes, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="g" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></radialGradient></defs><circle cx="32" cy="32" r="28" fill="${bg}"/><circle cx="32" cy="32" r="28" fill="url(#g)"/><g fill="none" stroke="#5A3A4A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${eyes}${mouth}</g><circle cx="18" cy="38" r="4" fill="#FF8FB1" opacity=".55"/><circle cx="46" cy="38" r="4" fill="#FF8FB1" opacity=".55"/>${extra}</svg>`;
  const moods = {
    happy: face('#FFD98E', '<path d="M22 38q10 10 20 0"/>', '<path d="M20 28q3-4 6 0M38 28q3-4 6 0"/>'),
    fun: face('#FFB3C7', '<path d="M20 36q12 14 24 0z" fill="#5A3A4A"/>', '<path d="M18 26l8 2M38 28l8-2"/>', '<path d="M8 12l3 3M56 12l-3 3M10 50l3-2" stroke="#FF6F9D" stroke-width="3" stroke-linecap="round"/>'),
    calm: face('#CDE7D8', '<path d="M24 40h16"/>', '<circle cx="23" cy="28" r="2" fill="#5A3A4A"/><circle cx="41" cy="28" r="2" fill="#5A3A4A"/>'),
    sleepy: face('#C9D7FF', '<ellipse cx="32" cy="41" rx="4" ry="3"/>', '<path d="M19 30h8M37 30h8"/>', '<text x="44" y="18" font-size="10" font-weight="700" fill="#5A3A4A">z</text><text x="50" y="12" font-size="8" font-weight="700" fill="#5A3A4A">z</text>'),
    sad: face('#BBD5F5', '<path d="M24 42q8-6 16 0"/>', '<path d="M20 30q3 3 6 0M38 30q3 3 6 0"/>', '<path d="M44 34q0 6-2 8" stroke="#5AA9FF" stroke-width="3" stroke-linecap="round"/>'),
    angry: face('#FFB199', '<path d="M24 42q8-5 16 0"/>', '<path d="M19 26l8 3M45 26l-8 3"/>', '<path d="M50 14l4 4M54 14l-4 4" stroke="#E5484D" stroke-width="3" stroke-linecap="round"/>'),
    love: face('#FFC1D8', '<path d="M24 38q8 8 16 0"/>', '<path d="M19 27c0-2 3-3 4-1 1-2 4-1 4 1 0 2-4 5-4 5s-4-3-4-5zM37 27c0-2 3-3 4-1 1-2 4-1 4 1 0 2-4 5-4 5s-4-3-4-5z" fill="#E5484D" stroke="none"/>'),
  };
  const moodKeys = Object.keys(moods);

  const weather = {
    sunny: S('<circle cx="12" cy="12" r="4" fill="#FFC75F" stroke="#F0A500"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="#F0A500"/>'),
    cloudy: S('<path d="M17.5 19a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 12.6 3.5 3.5 0 0 0 6 19z" fill="#DDEFFF" stroke="#82C4FF"/>'),
    rainy: S('<path d="M17.5 16a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 9.6 3.5 3.5 0 0 0 6 16z" fill="#DDEFFF" stroke="#82C4FF"/><path d="M8 18v3M12 19v3M16 18v3" stroke="#5AA9FF"/>'),
    snowy: S('<path d="M17.5 15a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.3 8.6 3.5 3.5 0 0 0 6 15z" fill="#F3F7FF" stroke="#A9C9F5"/><path d="M8 19h.01M12 21h.01M16 19h.01M10 22h.01M14 18h.01" stroke="#82C4FF" stroke-width="3"/>'),
    windy: S('<path d="M4 8h10a3 3 0 1 0-3-3M4 13h14a3 3 0 1 1-3 3M4 18h7a2 2 0 1 1-2 2" stroke="#7FB8E6"/>'),
  };
  const weatherKeys = Object.keys(weather);

  /* Stickers (used inline as :name: tokens) */
  const stickers = {
    sakura: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="#FFB3C7" stroke="#FF6F9D" stroke-width="2"><path d="M32 12c6-8 16-4 12 6-2 5-8 8-12 14-4-6-10-9-12-14-4-10 6-14 12-6z"/><path d="M50 26c10 0 10 12 1 13-5 1-11-2-19-2 6-6 8-11 18-11z"/><path d="M44 50c4 9-8 13-12 5-2-4 0-10 0-18 6 4 10 6 12 13z"/><path d="M20 50c-4 9 8 13 12 5 2-4 0-10 0-18-6 4-10 6-12 13z"/><path d="M14 26c-10 0-10 12-1 13 5 1 11-2 19-2-6-6-8-11-18-11z"/></g><circle cx="32" cy="34" r="5" fill="#FFC75F"/></svg>`,
    onigiri: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8c6 0 24 24 24 36 0 8-6 12-12 12H20c-6 0-12-4-12-12C8 32 26 8 32 8z" fill="#fff" stroke="#4A2E45" stroke-width="2.5"/><path d="M22 56V40h20v16z" fill="#2E5E3E"/><circle cx="26" cy="30" r="2" fill="#4A2E45"/><circle cx="38" cy="30" r="2" fill="#4A2E45"/><path d="M28 36q4 3 8 0" stroke="#4A2E45" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    neko: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 22 10 8l14 8h16l14-8-4 14z" fill="#fff" stroke="#4A2E45" stroke-width="2.5" stroke-linejoin="round"/><rect x="10" y="20" width="44" height="36" rx="18" fill="#fff" stroke="#4A2E45" stroke-width="2.5"/><path d="M22 36q2-3 4 0M38 36q2-3 4 0" stroke="#4A2E45" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M29 42q3 3 6 0" stroke="#4A2E45" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="18" cy="42" r="3" fill="#FF8FB1" opacity=".7"/><circle cx="46" cy="42" r="3" fill="#FF8FB1" opacity=".7"/><path d="M26 46h-8M46 46h-8" stroke="#4A2E45" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="32" cy="40" rx="2" ry="1.4" fill="#FF6F9D"/></svg>`,
    daruma: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c16 0 24 16 24 30 0 14-10 22-24 22S8 50 8 36C8 22 16 6 32 6z" fill="#E5484D" stroke="#4A2E45" stroke-width="2.5"/><path d="M32 16c9 0 15 8 15 18s-6 18-15 18-15-8-15-18 6-18 15-18z" fill="#FFF3E0"/><circle cx="25" cy="30" r="4" fill="#fff" stroke="#4A2E45" stroke-width="2"/><circle cx="39" cy="30" r="4" fill="#fff" stroke="#4A2E45" stroke-width="2"/><circle cx="25" cy="30" r="2" fill="#4A2E45"/><path d="M27 42q5 3 10 0" stroke="#4A2E45" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 24l6-2M44 24l-6-2" stroke="#4A2E45" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    torii: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 14q24-6 48 0v6H8z" fill="#E5484D" stroke="#4A2E45" stroke-width="2.5"/><rect x="12" y="24" width="40" height="5" fill="#E5484D" stroke="#4A2E45" stroke-width="2"/><rect x="16" y="18" width="7" height="40" fill="#E5484D" stroke="#4A2E45" stroke-width="2"/><rect x="41" y="18" width="7" height="40" fill="#E5484D" stroke="#4A2E45" stroke-width="2"/><rect x="28" y="24" width="8" height="10" fill="#FFF3E0" stroke="#4A2E45" stroke-width="2"/></svg>`,
    fuji: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M4 54 32 12l28 42z" fill="#8EC5FF" stroke="#4A2E45" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 27l4 4 6-5 6 5 4-4-10-15z" fill="#fff" stroke="#4A2E45" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="16" r="6" fill="#FF6F9D"/><path d="M8 48h8M44 44h10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/></svg>`,
    tea: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 26h36v16a12 12 0 0 1-12 12H24a12 12 0 0 1-12-12z" fill="#5FC79F" stroke="#4A2E45" stroke-width="2.5"/><path d="M48 30h4a6 6 0 0 1 0 12h-4" fill="none" stroke="#4A2E45" stroke-width="2.5"/><ellipse cx="30" cy="26" rx="18" ry="4" fill="#CDEFDB" stroke="#4A2E45" stroke-width="2"/><path d="M24 18q2-4 0-8M32 18q2-4 0-8M40 18q2-4 0-8" stroke="#8A6E86" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    star: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m32 6 7.5 16 17.5 2-13 12 3.5 17L32 44l-15.5 9 3.5-17-13-12 17.5-2z" fill="#FFC75F" stroke="#4A2E45" stroke-width="2.5" stroke-linejoin="round"/><circle cx="26" cy="30" r="2" fill="#4A2E45"/><circle cx="38" cy="30" r="2" fill="#4A2E45"/><path d="M28 36q4 3 8 0" stroke="#4A2E45" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    heart: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 56S6 40 6 22a12 12 0 0 1 26-7 12 12 0 0 1 26 7c0 18-26 34-26 34z" fill="#FF6F9D" stroke="#4A2E45" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 20q2-6 8-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></svg>`,
    rainbow: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 50a26 26 0 0 1 52 0" fill="none" stroke="#FF6F9D" stroke-width="6"/><path d="M14 50a18 18 0 0 1 36 0" fill="none" stroke="#FFC75F" stroke-width="6"/><path d="M22 50a10 10 0 0 1 20 0" fill="none" stroke="#5FC79F" stroke-width="6"/><circle cx="12" cy="52" r="6" fill="#fff" stroke="#4A2E45" stroke-width="2"/><circle cx="52" cy="52" r="6" fill="#fff" stroke="#4A2E45" stroke-width="2"/></svg>`,
    dango: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 54 50 10" stroke="#B07A00" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="42" r="9" fill="#5FC79F" stroke="#4A2E45" stroke-width="2.5"/><circle cx="34" cy="30" r="9" fill="#fff" stroke="#4A2E45" stroke-width="2.5"/><circle cx="44" cy="18" r="9" fill="#FFB3C7" stroke="#4A2E45" stroke-width="2.5"/></svg>`,
    bunny: `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="24" cy="16" rx="6" ry="13" fill="#fff" stroke="#4A2E45" stroke-width="2.5"/><ellipse cx="40" cy="16" rx="6" ry="13" fill="#fff" stroke="#4A2E45" stroke-width="2.5"/><ellipse cx="24" cy="16" rx="3" ry="9" fill="#FFB3C7"/><ellipse cx="40" cy="16" rx="3" ry="9" fill="#FFB3C7"/><rect x="10" y="24" width="44" height="34" rx="17" fill="#fff" stroke="#4A2E45" stroke-width="2.5"/><circle cx="24" cy="40" r="2.5" fill="#4A2E45"/><circle cx="40" cy="40" r="2.5" fill="#4A2E45"/><path d="M29 46q3 3 6 0" stroke="#4A2E45" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="18" cy="46" r="3" fill="#FF8FB1" opacity=".7"/><circle cx="46" cy="46" r="3" fill="#FF8FB1" opacity=".7"/></svg>`,
  };
  const stickerKeys = Object.keys(stickers);

  /* Mascot: maneki-neko with sakura */
  const mascot = `<svg viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="mg" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#FFF0F5"/></radialGradient></defs>
  <ellipse cx="100" cy="178" rx="62" ry="10" fill="#000" opacity=".08"/>
  <path d="M60 60 50 22l30 20h40l30-20-10 38z" fill="url(#mg)" stroke="#4A2E45" stroke-width="4" stroke-linejoin="round"/>
  <path d="M62 45l12 10M138 45l-12 10" fill="none" stroke="#FFB3C7" stroke-width="5" stroke-linecap="round"/>
  <rect x="38" y="55" width="124" height="118" rx="56" fill="url(#mg)" stroke="#4A2E45" stroke-width="4"/>
  <path d="M150 90c18-6 26 10 16 22-6 8-18 8-22-4" fill="#fff" stroke="#4A2E45" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M70 100q5-8 10 0M120 100q5-8 10 0" fill="none" stroke="#4A2E45" stroke-width="4" stroke-linecap="round"/>
  <path d="M93 112q7 6 14 0" fill="none" stroke="#4A2E45" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="100" cy="108" rx="4" ry="3" fill="#FF6F9D"/>
  <circle cx="62" cy="114" r="8" fill="#FF8FB1" opacity=".6"/><circle cx="138" cy="114" r="8" fill="#FF8FB1" opacity=".6"/>
  <path d="M60 110H46M60 116H48M140 110h14M140 116h12" stroke="#4A2E45" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M64 150q36 10 72 0" fill="none" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/>
  <circle cx="100" cy="156" r="11" fill="#FFC75F" stroke="#4A2E45" stroke-width="3"/><path d="M100 150v12M95 156h10" stroke="#4A2E45" stroke-width="2.5" stroke-linecap="round"/>
  <g transform="translate(24 28) scale(.55)"><g fill="#FFB3C7" stroke="#FF6F9D" stroke-width="3"><path d="M32 12c6-8 16-4 12 6-2 5-8 8-12 14-4-6-10-9-12-14-4-10 6-14 12-6z"/><path d="M50 26c10 0 10 12 1 13-5 1-11-2-19-2 6-6 8-11 18-11z"/><path d="M44 50c4 9-8 13-12 5-2-4 0-10 0-18 6 4 10 6 12 13z"/><path d="M20 50c-4 9 8 13 12 5 2-4 0-10 0-18-6 4-10 6-12 13z"/><path d="M14 26c-10 0-10 12-1 13 5 1 11-2 19-2-6-6-8-11-18-11z"/></g><circle cx="32" cy="34" r="5" fill="#FFC75F"/></g>
  </svg>`;

  /* Sakura tree, grows by stage 0..5 */
  function tree(stage) {
    const clusters = [
      [110, 70, 22], [80, 80, 18], [140, 82, 18], [95, 55, 16], [125, 52, 16], [65, 100, 14], [155, 100, 14], [110, 40, 14], [85, 38, 12], [135, 38, 12], [50, 80, 12], [170, 82, 12],
    ];
    const n = [0, 2, 5, 8, 10, 12][Math.min(stage, 5)];
    let blossoms = '';
    for (let i = 0; i < n; i++) {
      const [x, y, r] = clusters[i];
      blossoms += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFB3C7" stroke="#FF8FB1" stroke-width="2"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff" opacity=".6"/>`;
    }
    const buds = stage === 0 ? '<circle cx="104" cy="78" r="4" fill="#5FC79F"/><circle cx="120" cy="66" r="4" fill="#5FC79F"/><circle cx="90" cy="68" r="4" fill="#5FC79F"/>' : '';
    const petals = stage >= 4 ? '<g fill="#FFB3C7" opacity=".8"><ellipse cx="40" cy="140" rx="4" ry="2.5" transform="rotate(-20 40 140)"/><ellipse cx="180" cy="150" rx="4" ry="2.5" transform="rotate(30 180 150)"/><ellipse cx="60" cy="160" rx="4" ry="2.5"/><ellipse cx="150" cy="135" rx="4" ry="2.5" transform="rotate(-40 150 135)"/></g>' : '';
    return `<svg viewBox="0 0 220 180" aria-hidden="true"><ellipse cx="110" cy="170" rx="70" ry="8" fill="#5FC79F" opacity=".35"/>
      <path d="M110 170V110M110 118q-20-10-34-34M110 112q18-8 34-32M110 100q-6-14-18-24M110 96q8-14 16-26" fill="none" stroke="#8B5A3C" stroke-width="10" stroke-linecap="round"/>
      ${buds}${blossoms}${petals}</svg>`;
  }

  window.ICONS = { get: (n) => icons[n] || '', icons, moods, moodKeys, weather, weatherKeys, stickers, stickerKeys, mascot, tree };
})();
