/* App — UI, routing, views */
(function () {
  const { t } = I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Date helpers ---------- */
  const DOW_JA = ['日', '月', '火', '水', '木', '金', '土'];
  function parseISO(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
  function fmtJa(iso) { const d = parseISO(iso); return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DOW_JA[d.getDay()]}）`; }
  function fmtFa(iso) { try { return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(parseISO(iso)); } catch (e) { return ''; } }
  function fmtEn(iso) { try { return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(parseISO(iso)); } catch (e) { return iso; } }
  function fmtDate(iso) { return I18N.lang === 'fa' ? `${fmtJa(iso)} · ${fmtFa(iso)}` : I18N.lang === 'en' ? `${fmtJa(iso)} · ${fmtEn(iso)}` : fmtJa(iso); }
  function fmtTime(isoDateTime) { try { return new Date(isoDateTime).toLocaleString(I18N.lang === 'fa' ? 'fa-IR' : I18N.lang === 'en' ? 'en-GB' : 'ja-JP', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return isoDateTime; } }

  /* ---------- Content data ---------- */
  const PROMPTS = [
    'きょう いちばん たのしかったことは なに？', 'きょう たべた おいしいものは？', 'ともだちと なにを はなした？', 'いま いちばん ほしいものは？',
    'きょうの てんきは どうだった？ なにを おもった？', 'がっこうで おぼえた あたらしいことは？', 'あした したいことは なに？', 'すきな うたは なに？ どうして？',
    'きょう だれかに ありがとうを いった？', 'さいきん よんだ ほんや みた アニメは？', 'ちいさな しあわせを みつけた？', 'きょうの じぶんに 100てんまんてんで なんてん？',
    'もし まほうが つかえたら なにをする？', 'かぞくと なにを した？', 'きょう わらったのは どんなとき？', 'にほんで いってみたい ところは？',
  ];
  const HIRAGANA = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'や　ゆ　よ', 'らりるれろ', 'わ　を　ん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ', 'ゃ　ゅ　ょ', 'っ、。ー！'];
  const KATAKANA = ['アイウエオ', 'カキクケコ', 'サシスセソ', 'タチツテト', 'ナニヌネノ', 'ハヒフヘホ', 'マミムメモ', 'ヤ　ユ　ヨ', 'ラリルレロ', 'ワ　ヲ　ン', 'ガギグゲゴ', 'ザジズゼゾ', 'ダヂヅデド', 'バビブベボ', 'パピプペポ', 'ャ　ュ　ョ', 'ッ、。ー！'];
  const PHRASES = [
    ['きょうは、〜に行きました。', 'Today I went to ~ / امروز به ~ رفتم'], ['とても楽しかったです。', 'It was really fun / خیلی خوش گذشت'], ['〜を食べました。', 'I ate ~ / ~ خوردم'],
    ['ともだちと遊びました。', 'I played with friends / با دوستام بازی کردم'], ['がっこうで〜を勉強しました。', 'I studied ~ at school / در مدرسه ~ خواندم'], ['うれしかったです。', 'I was happy / خوشحال بودم'],
    ['ちょっとつかれました。', 'I was a bit tired / کمی خسته شدم'], ['あしたは〜したいです。', 'Tomorrow I want to ~ / فردا می‌خوام ~'], ['おもしろかった！', 'It was interesting! / جالب بود!'],
    ['〜がだいすきです。', 'I love ~ / عاشق ~ هستم'], ['きょうのてんきは はれでした。', 'Today was sunny / امروز آفتابی بود'], ['また書くね。おやすみなさい。', 'I’ll write again. Good night / باز می‌نویسم. شب بخیر'],
  ];
  const KAOMOJI = ['(๑˃̵ᴗ˂̵)', '(´｡• ᵕ •｡`) ♡', '(≧▽≦)', '(｡•̀ᴗ-)✧', '(´；ω；`)', '(*´꒳`*)', '(๑•̀ㅂ•́)و✧', '(つ≧▽≦)つ', '( ˘ω˘ )', '(⁎˃ᆺ˂)', '♪(´ε｀ )', '(｡>﹏<｡)', '✿', '☆', '♡', '(*^▽^*)'];
  const THEMES = [['sakura', '#FF6F9D', 'さくら'], ['matcha', '#4DB37E', 'まっちゃ'], ['sora', '#5AA9FF', 'そら'], ['yozora', '#2B2546', 'よぞら']];
  const BADGES = [
    { id: 'first', icon: 'pen', test: s => s.entries.length >= 1 },
    { id: 'streak3', icon: 'flame', test: s => streak(s.entries) >= 3 },
    { id: 'streak7', icon: 'flame', test: s => streak(s.entries) >= 7 },
    { id: 'ten', icon: 'book', test: s => s.entries.length >= 10 },
    { id: 'thirty', icon: 'book', test: s => s.entries.length >= 30 },
    { id: 'hundred', icon: 'star', test: s => s.entries.length >= 100 },
    { id: 'words10', icon: 'abc', test: s => s.words.length >= 10 },
    { id: 'long', icon: 'type', test: s => s.entries.some(e => e.body.length >= 300) },
    { id: 'fav', icon: 'heart', test: s => s.entries.filter(e => e.favorite).length >= 5 },
    { id: 'allmoods', icon: 'smile', test: s => ICONS.moodKeys.every(m => s.entries.some(e => e.mood === m)) },
    { id: 'night', icon: 'moon', test: s => s.profile.theme === 'yozora' || s.earned.includes('night') },
  ];

  /* ---------- Stats ---------- */
  function streak(entries) {
    const days = new Set(entries.map(e => e.date));
    if (!days.size) return 0;
    let d = new Date(); let iso = Store.todayISO(d);
    if (!days.has(iso)) { d.setDate(d.getDate() - 1); iso = Store.todayISO(d); if (!days.has(iso)) return 0; }
    let n = 0;
    while (days.has(Store.todayISO(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const treeStage = n => n >= 50 ? 5 : n >= 20 ? 4 : n >= 10 ? 3 : n >= 5 ? 2 : n >= 1 ? 1 : 0;
  const TREE_NEXT = [1, 5, 10, 20, 50];

  /* ---------- Toasts & dialogs ---------- */
  function toast(msg, { type = 'ok', action, onAction, ms = 4000 } = {}) {
    const el = document.createElement('div');
    el.className = `toast is-${type}`;
    el.innerHTML = `${ICONS.get(type === 'err' ? 'alert' : 'check')}<span>${esc(msg)}</span>${action ? `<button class="btn" type="button">${esc(action)}</button>` : ''}`;
    $('#toasts').appendChild(el);
    const close = () => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 200); };
    if (action) $('button', el).addEventListener('click', () => { onAction && onAction(); close(); });
    setTimeout(close, ms);
  }
  function confirmDlg(title, text, { danger = true } = {}) {
    return new Promise(resolve => {
      const dlg = $('#dlgConfirm');
      $('#dlgConfirmTitle').textContent = title; $('#dlgConfirmText').textContent = text;
      const okBtn = $('#dlgConfirmOk'); okBtn.className = danger ? 'btn btn-danger' : 'btn btn-primary';
      const ico = $('.dlg-ico', dlg); ico.classList.toggle('is-friendly', !danger); ico.innerHTML = ICONS.get(danger ? 'alert' : 'sparkles');
      dlg.returnValue = 'cancel';
      dlg.addEventListener('close', () => resolve(dlg.returnValue === 'ok'), { once: true });
      dlg.showModal();
    });
  }

  /* ---------- Theme / lang / petals ---------- */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.setAttribute('data-theme-set', '1');
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = (THEMES.find(x => x[0] === theme) || THEMES[0])[1];
    $$('.theme-dot').forEach(b => b.classList.toggle('is-active', b.dataset.theme === theme));
    $$('.theme-card').forEach(b => b.classList.toggle('is-active', b.dataset.theme === theme));
  }
  function applyLang(lang) {
    I18N.setLang(lang);
    $('#langSelect').value = lang; $('#profileLang').value = lang;
    renderNav(); renderAll();
  }
  function renderPetals(on) {
    const wrap = $('#petals'); wrap.innerHTML = '';
    if (!on || reducedMotion.matches) return;
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('span'); p.className = 'petal';
      p.style.left = Math.random() * 100 + 'vw'; p.style.setProperty('--dur', 9 + Math.random() * 10 + 's'); p.style.setProperty('--delay', -Math.random() * 15 + 's');
      p.style.transform = `scale(${.6 + Math.random() * .8})`;
      wrap.appendChild(p);
    }
  }

  /* ---------- Icons into [data-icon] ---------- */
  function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => { if (!el.firstElementChild) el.innerHTML = ICONS.get(el.dataset.icon); }); }

  /* ---------- Navigation & routing ---------- */
  const VIEWS = ['home', 'write', 'diary', 'words', 'settings'];
  const NAV_ICON = { home: 'home', write: 'pen', diary: 'book', words: 'abc', settings: 'settings' };
  function renderNav() {
    const html = VIEWS.map(v => `<a class="nav-btn" href="#${v}" data-nav="${v}" ${v === 'write' ? 'data-edit-only' : ''}>${ICONS.get(NAV_ICON[v])}<span>${esc(t('nav.' + v))}</span></a>`).join('');
    $('#sidenav').innerHTML = html; $('#bottomnav').innerHTML = html;
    markNav();
  }
  let currentView = 'home';
  function markNav() { $$('[data-nav]').forEach(a => { const on = a.dataset.nav === currentView; a.classList.toggle('is-active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function route() {
    const hash = location.hash.replace('#', '') || 'home';
    const [view, arg] = hash.split('/');
    if (view === 'entry' && arg) { openEntry(arg); return; }
    let v = VIEWS.includes(view) ? view : 'home';
    if (v === 'write' && !Auth.canEdit()) { openUnlock(() => { if (location.hash === '#' + hash) route(); else location.hash = hash; }); v = 'home'; }
    currentView = v;
    $$('.view').forEach(s => { s.hidden = s.dataset.view !== v; });
    markNav();
    if (v === 'write' && arg === 'new') { resetWriteForm(); }
    if (v === 'write' && arg && arg !== 'new' && arg.startsWith('date-')) { resetWriteForm(); $('#entryDate').value = arg.slice(5); }
    if (v === 'write' && arg && Store.getEntry(arg)) beginEdit(arg);
    renderView(v);
    $('#main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }
  function renderView(v) { ({ home: renderHome, write: renderWriteStatic, diary: renderDiary, words: renderWords, settings: renderSettings })[v](); }
  function renderAll() { applyLockUI(); renderHome(); renderWriteStatic(); renderDiary(); renderWords(); renderSettings(); updateBrand(); }
  function updateBrand() { const iso = Store.todayISO(); $('#brandDate').textContent = I18N.lang === 'fa' ? fmtFa(iso) : fmtJa(iso); }

  /* ---------- HOME ---------- */
  let promptIdx = Math.floor(Math.random() * PROMPTS.length);
  function renderHome() {
    const s = Store.state; const name = s.profile.name || 'レイハーネ';
    const h = new Date().getHours();
    $('#homeGreeting').textContent = t(h < 11 ? 'home.greet.morning' : h < 18 ? 'home.greet.day' : 'home.greet.evening', { name });
    $('#homeDateLine').textContent = fmtDate(Store.todayISO());
    const chars = s.entries.reduce((n, e) => n + e.body.length, 0);
    const stats = [['c1', 'flame', streak(s.entries), 'home.streak'], ['c2', 'book', s.entries.length, 'home.entries'], ['c3', 'type', chars, 'home.chars'], ['c4', 'abc', s.words.length, 'home.words']];
    $('#statsGrid').innerHTML = stats.map(([c, ic, val, key]) => `<div class="clay stat"><div class="stat-ico ${c}">${ICONS.get(ic)}</div><div><div class="stat-val">${val.toLocaleString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US')}</div><div class="stat-lbl">${esc(t(key))}</div></div></div>`).join('');
    $('#promptText').textContent = PROMPTS[promptIdx];
    const stage = treeStage(s.entries.length);
    $('#treeWrap').innerHTML = ICONS.tree(stage);
    const next = TREE_NEXT.find(n => n > s.entries.length);
    const prev = stage === 0 ? 0 : TREE_NEXT[stage - 1];
    $('#treeBar').style.width = next ? Math.round(((s.entries.length - prev) / (next - prev)) * 100) + '%' : '100%';
    $('#treeHint').textContent = next ? t('home.tree.hint', { n: next - s.entries.length }) : t('home.tree.full');
    // badges
    const earnedNow = BADGES.filter(b => b.test(s)).map(b => b.id);
    const newly = Store.markEarned(earnedNow);
    $('#badgesGrid').innerHTML = BADGES.map(b => { const on = s.earned.includes(b.id); return `<div class="badge ${on ? 'is-earned' : ''}" title="${esc(t('badge.' + b.id + '.d'))}"><div class="badge-ico">${ICONS.get(b.icon)}</div><span>${esc(t('badge.' + b.id))}</span><span class="muted" style="font-weight:500">${esc(t('badge.' + b.id + '.d'))}</span></div>`; }).join('');
    $('#recentEntries').innerHTML = s.entries.length ? s.entries.slice(0, 3).map(entryCard).join('') : emptyState(t('home.empty'));
  }
  $('#promptBtn').addEventListener('click', () => { promptIdx = (promptIdx + 1 + Math.floor(Math.random() * (PROMPTS.length - 1))) % PROMPTS.length; $('#promptText').textContent = PROMPTS[promptIdx]; });
  $('#promptUseBtn').addEventListener('click', () => { resetWriteForm(); $('#entryBody').value = PROMPTS[promptIdx] + '\n\n'; location.hash = '#write'; setTimeout(() => { const ta = $('#entryBody'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); updateCounter(); }, 50); });

  function emptyState(text) { return `<div class="empty">${ICONS.stickers.neko}<p>${esc(text)}</p><a class="btn btn-primary" href="#write/new">${ICONS.get('pen')}<span>${esc(t('home.writeNow'))}</span></a></div>`; }

  /* ---------- Entry rendering ---------- */
  function renderBody(body) {
    return esc(body).replace(/:([a-z]+):/g, (m, k) => ICONS.stickers[k] ? `<span class="sticker-inline">${ICONS.stickers[k]}</span>` : m);
  }
  function excerpt(body) { return body.replace(/:([a-z]+):/g, '').slice(0, 120); }
  function entryCard(e, i = 0) {
    return `<button type="button" class="clay entry-card" data-open="${e.id}" style="--i:${i}">
      ${e.favorite ? `<span class="entry-fav" aria-label="${esc(t('write.favorite'))}">${ICONS.get('heartFill')}</span>` : ''}
      <div class="entry-top"><span class="entry-mood">${ICONS.moods[e.mood] || ''}</span><div><div class="entry-date">${esc(fmtJa(e.date))}</div><div class="entry-title">${renderBody(e.title || t('write.untitled'))}</div></div></div>
      <p class="entry-excerpt">${esc(excerpt(e.body))}</p>
      <div class="entry-tags"><span class="entry-wx" title="${esc(t('wx.' + e.weather))}">${ICONS.weather[e.weather] || ''}</span>${e.tags.map(tag => `<span class="tag">#${esc(tag)}</span>`).join('')}</div>
    </button>`;
  }
  document.addEventListener('click', ev => {
    const card = ev.target.closest('[data-open]'); if (card) { openEntry(card.dataset.open); return; }
  });

  /* ---------- Read dialog ---------- */
  function openEntry(id) {
    const e = Store.getEntry(id); if (!e) return;
    const dlg = $('#dlgEntry');
    $('#dlgEntryBody').innerHTML = `
      <button type="button" class="icon-btn read-close" id="readClose" aria-label="${esc(t('common.close'))}">${ICONS.get('x')}</button>
      <div class="read-head"><span class="read-mood">${ICONS.moods[e.mood] || ''}</span><div><h2 class="read-title" id="dlgEntryTitle">${renderBody(e.title || t('write.untitled'))}</h2>
        <div class="read-meta"><span>${esc(fmtDate(e.date))}</span><span>·</span>${ICONS.weather[e.weather] || ''}<span>${esc(t('wx.' + e.weather))}</span><span>·</span><span>${esc(t('mood.' + e.mood))}</span></div></div></div>
      <div class="read-body">${renderBody(e.body)}<span class="hanko" aria-hidden="true">${esc((Store.state.profile.name || 'レイハーネ').slice(0, 4))}</span></div>
      <div class="entry-tags" style="margin-top:12px">${e.tags.map(tag => `<span class="tag">#${esc(tag)}</span>`).join('')}</div>
      <div class="read-actions" data-edit-only>
        <button type="button" class="btn btn-ghost" id="readDelete">${ICONS.get('trash')}<span>${esc(t('diary.delete'))}</span></button>
        <div class="row gap"><button type="button" class="btn btn-soft" id="readFav">${ICONS.get(e.favorite ? 'heartFill' : 'heart')}<span>${esc(t('write.favorite'))}</span></button>
        <button type="button" class="btn btn-primary" id="readEdit">${ICONS.get('edit')}<span>${esc(t('diary.edit'))}</span></button></div>
      </div>`;
    $('#readClose').onclick = () => dlg.close();
    $('#readEdit').onclick = () => { dlg.close(); location.hash = '#write/' + e.id; };
    $('#readFav').onclick = () => { Store.updateEntry(e.id, { favorite: !e.favorite }); openEntry(e.id); renderDiary(); renderHome(); };
    $('#readDelete').onclick = async () => { if (await confirmDlg(t('diary.deleteTitle'), t('diary.deleteConfirm'))) { dlg.close(); removeEntry(e.id); } };
    if (!dlg.open) dlg.showModal();
  }
  $('#dlgEntry').addEventListener('click', ev => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });
  function removeEntry(id) {
    const removed = Store.deleteEntry(id); if (!removed) return;
    renderDiary(); renderHome();
    toast(t('diary.deleted'), { action: t('diary.undo'), ms: 7000, onAction: () => { Store.restoreEntry(removed); renderDiary(); renderHome(); toast(t('diary.restored')); } });
    if (Store.state.github.autosync) autoPush();
  }

  /* ---------- WRITE ---------- */
  let editingId = null; let helperTab = 'hiragana';
  const form = $('#writeForm'); const body = $('#entryBody');
  function renderWriteStatic() {
    const cur = $('#moodPicker').dataset.value || 'happy';
    $('#moodPicker').innerHTML = ICONS.moodKeys.map(m => `<button type="button" class="mood-btn" role="radio" data-mood="${m}" aria-checked="${m === cur}">${ICONS.moods[m]}<span>${esc(t('mood.' + m))}</span></button>`).join('');
    $('#moodPicker').dataset.value = cur;
    const wx = $('#weatherPicker').dataset.value || 'sunny';
    $('#weatherPicker').innerHTML = ICONS.weatherKeys.map(w => `<button type="button" class="wx-btn" role="radio" data-wx="${w}" aria-checked="${w === wx}">${ICONS.weather[w]}<span>${esc(t('wx.' + w))}</span></button>`).join('');
    $('#weatherPicker').dataset.value = wx;
    const tabs = [['hiragana', 'write.hiragana'], ['katakana', 'write.katakana'], ['phrases', 'write.phrases'], ['kaomoji', 'write.kaomoji'], ['stickers', 'write.stickers']];
    $('#helperTabs').innerHTML = tabs.map(([k, key]) => `<button type="button" class="tab" role="tab" data-tab="${k}" aria-selected="${k === helperTab}">${esc(t(key))}</button>`).join('');
    renderHelperBody();
    if (!$('#entryDate').value) $('#entryDate').value = Store.todayISO();
    updateCounter();
  }
  function renderHelperBody() {
    const el = $('#helperBody');
    if (helperTab === 'hiragana' || helperTab === 'katakana') {
      const rows = helperTab === 'hiragana' ? HIRAGANA : KATAKANA;
      el.innerHTML = `<div class="kana-grid">${rows.map(r => [...r].map(ch => ch === '　' ? '<span class="kana-btn is-empty"></span>' : `<button type="button" class="kana-btn" data-ins="${esc(ch)}">${esc(ch)}</button>`).join('')).join('')}</div>`;
    } else if (helperTab === 'phrases') {
      el.innerHTML = `<div class="phrase-list">${PHRASES.map(([p, h]) => `<button type="button" class="phrase-btn" data-ins="${esc(p)}">${esc(p)}<small>${esc(h)}</small></button>`).join('')}</div>`;
    } else if (helperTab === 'kaomoji') {
      el.innerHTML = `<div class="kaomoji-grid">${KAOMOJI.map(k => `<button type="button" class="kana-btn" data-ins="${esc(k + ' ')}">${esc(k)}</button>`).join('')}</div>`;
    } else {
      el.innerHTML = `<div class="sticker-grid">${ICONS.stickerKeys.map(k => `<button type="button" class="sticker-btn" data-ins=":${k}:" aria-label="${k}">${ICONS.stickers[k]}</button>`).join('')}</div>`;
    }
  }
  $('#helperTabs').addEventListener('click', ev => { const b = ev.target.closest('[data-tab]'); if (!b) return; helperTab = b.dataset.tab; $$('.tab').forEach(x => x.setAttribute('aria-selected', x === b)); renderHelperBody(); });
  $('#helperBody').addEventListener('click', ev => { const b = ev.target.closest('[data-ins]'); if (!b) return; insertAtCursor(body, b.dataset.ins); });
  function insertAtCursor(ta, text) {
    const s = ta.selectionStart ?? ta.value.length, e = ta.selectionEnd ?? ta.value.length;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    ta.focus(); ta.setSelectionRange(s + text.length, s + text.length);
    updateCounter(); saveDraft();
  }
  $('#moodPicker').addEventListener('click', ev => { const b = ev.target.closest('[data-mood]'); if (!b) return; $('#moodPicker').dataset.value = b.dataset.mood; $$('[data-mood]').forEach(x => x.setAttribute('aria-checked', x === b)); saveDraft(); });
  $('#weatherPicker').addEventListener('click', ev => { const b = ev.target.closest('[data-wx]'); if (!b) return; $('#weatherPicker').dataset.value = b.dataset.wx; $$('[data-wx]').forEach(x => x.setAttribute('aria-checked', x === b)); saveDraft(); });
  function updateCounter() { $('#charCounter').textContent = t('write.chars', { n: body.value.replace(/\s/g, '').length }); }
  const saveDraft = debounce(() => {
    if (editingId) return;
    Store.setDraft(readForm());
    $('#draftNote').textContent = t('write.draft');
  }, 500);
  body.addEventListener('input', () => { updateCounter(); $('#bodyError').hidden = true; body.removeAttribute('aria-invalid'); saveDraft(); });
  ['#entryTitle', '#entryTags', '#entryDate', '#entryFav'].forEach(sel => $(sel).addEventListener('input', saveDraft));
  function readForm() {
    return { date: $('#entryDate').value, title: $('#entryTitle').value, body: body.value, mood: $('#moodPicker').dataset.value || 'happy', weather: $('#weatherPicker').dataset.value || 'sunny', tags: $('#entryTags').value.split(/[,、，]/).map(x => x.trim()).filter(Boolean), favorite: $('#entryFav').checked };
  }
  function fillForm(e) {
    $('#entryDate').value = e.date || Store.todayISO(); $('#entryTitle').value = e.title || ''; body.value = e.body || '';
    $('#moodPicker').dataset.value = e.mood || 'happy'; $('#weatherPicker').dataset.value = e.weather || 'sunny';
    $('#entryTags').value = (e.tags || []).join(', '); $('#entryFav').checked = !!e.favorite;
    renderWriteStatic();
  }
  function resetWriteForm() { editingId = null; $('#editingChip').hidden = true; $('#cancelEditBtn').hidden = true; $('#draftNote').textContent = ''; fillForm({ date: Store.todayISO() }); }
  function beginEdit(id) { const e = Store.getEntry(id); if (!e) return; editingId = id; fillForm(e); $('#editingChip').hidden = false; $('#cancelEditBtn').hidden = false; $('#draftNote').textContent = ''; }
  $('#cancelEditBtn').addEventListener('click', () => { resetWriteForm(); location.hash = '#diary'; });
  $('#clearBtn').addEventListener('click', async () => { if (!body.value && !$('#entryTitle').value) return; if (await confirmDlg(t('write.clear'), t('write.clearConfirm'))) { const wasEditing = editingId; resetWriteForm(); if (wasEditing) beginEdit(wasEditing), fillForm({ ...Store.getEntry(wasEditing), body: '', title: '' }); Store.setDraft(null); } });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!Auth.canEdit()) { openUnlock(); return; }
    const data = readForm();
    if (!data.date) { toast(t('write.needDate'), { type: 'err' }); $('#entryDate').focus(); return; }
    if (!data.body.trim()) { $('#bodyError').textContent = t('write.needBody'); $('#bodyError').hidden = false; body.setAttribute('aria-invalid', 'true'); body.focus(); return; }
    const saveBtn = $('#saveBtn'); saveBtn.setAttribute('aria-busy', 'true');
    const wasEditing = !!editingId;
    const entry = wasEditing ? Store.updateEntry(editingId, data) : Store.addEntry(data);
    saveBtn.removeAttribute('aria-busy');
    toast(t(wasEditing ? 'write.updated' : 'write.saved'));
    resetWriteForm(); Store.setDraft(null);
    renderHome(); renderDiary();
    location.hash = '#entry/' + entry.id;
    if (Store.state.github.autosync) autoPush();
  });

  /* ---------- DIARY ---------- */
  let filter = 'all', mode = 'list', query = '', calMonth = null, calSelected = null;
  function filteredEntries() {
    const q = query.trim().toLowerCase();
    return Store.state.entries.filter(e => (filter !== 'fav' || e.favorite) && (!q || (e.title + ' ' + e.body + ' ' + e.tags.join(' ')).toLowerCase().includes(q)));
  }
  function renderDiary() {
    const list = filteredEntries();
    $('#diaryCount').textContent = t('diary.count', { n: Store.state.entries.length });
    $('#diaryList').hidden = mode !== 'list'; $('#diaryCalendar').hidden = mode !== 'calendar';
    if (mode === 'list') {
      $('#diaryList').innerHTML = list.length ? list.map((e, i) => entryCard(e, i)).join('') : Store.state.entries.length ? `<div class="empty">${ICONS.stickers.bunny}<p>${esc(t('diary.noResults'))}</p></div>` : emptyState(t('home.empty'));
    } else renderCalendar();
  }
  $('#searchInput').addEventListener('input', debounce(ev => { query = ev.target.value; renderDiary(); }, 200));
  $$('[data-filter]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.filter; $$('[data-filter]').forEach(x => x.classList.toggle('is-active', x === b)); renderDiary(); }));
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; $$('[data-mode]').forEach(x => x.classList.toggle('is-active', x === b)); renderDiary(); }));

  function renderCalendar() {
    const today = new Date(); if (!calMonth) calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const first = new Date(y, m, 1).getDay(); const days = new Date(y, m + 1, 0).getDate();
    const byDay = new Map(); Store.state.entries.forEach(e => { if (!byDay.has(e.date)) byDay.set(e.date, []); byDay.get(e.date).push(e); });
    const p = n => String(n).padStart(2, '0'); const todayISO = Store.todayISO();
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<span class="cal-day is-empty"></span>';
    for (let d = 1; d <= days; d++) {
      const iso = `${y}-${p(m + 1)}-${p(d)}`; const has = byDay.has(iso);
      cells += `<button type="button" class="cal-day ${has ? 'has-entry' : ''} ${iso === todayISO ? 'is-today' : ''} ${iso === calSelected ? 'is-selected' : ''}" data-day="${iso}" aria-label="${esc(fmtJa(iso))}${has ? ' · ' + byDay.get(iso).length : ''}">${d}</button>`;
    }
    const title = I18N.lang === 'fa' ? `${y}/${m + 1}` : I18N.lang === 'en' ? new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(calMonth) : `${y}年${m + 1}月`;
    const dows = I18N.lang === 'en' ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : I18N.lang === 'fa' ? ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'] : DOW_JA;
    const sel = calSelected ? (byDay.get(calSelected) || []) : [];
    $('#diaryCalendar').innerHTML = `
      <div class="cal-head"><button type="button" class="icon-btn" id="calPrev" aria-label="prev">${ICONS.get('chevronLeft')}</button><div class="cal-title">${esc(title)}</div><div class="row gap"><button type="button" class="btn btn-ghost" id="calToday">${esc(t('cal.today'))}</button><button type="button" class="icon-btn" id="calNext" aria-label="next">${ICONS.get('chevronRight')}</button></div></div>
      <div class="cal-grid">${dows.map((d, i) => `<span class="cal-dow ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</span>`).join('')}${cells}</div>
      ${calSelected ? `<div class="cal-list"><h3 class="sub-title">${esc(t('diary.dayEntries', { date: fmtJa(calSelected) }))}</h3><div class="entries-grid">${sel.length ? sel.map(entryCard).join('') : `<div class="empty" style="padding:16px"><p>${esc(t('diary.noDay'))}</p><a class="btn btn-primary" href="#write/date-${calSelected}">${ICONS.get('pen')}<span>${esc(t('diary.writeDay'))}</span></a></div>`}</div></div>` : ''}`;
    $('#calPrev').onclick = () => { calMonth = new Date(y, m - 1, 1); renderCalendar(); };
    $('#calNext').onclick = () => { calMonth = new Date(y, m + 1, 1); renderCalendar(); };
    $('#calToday').onclick = () => { calMonth = new Date(today.getFullYear(), today.getMonth(), 1); calSelected = todayISO; renderCalendar(); };
    $$('[data-day]').forEach(b => b.addEventListener('click', () => { calSelected = calSelected === b.dataset.day ? null : b.dataset.day; renderCalendar(); }));
  }

  /* ---------- WORDS ---------- */
  let practice = { order: [], i: 0, flipped: false };
  function renderWords() {
    const w = Store.state.words;
    $('#wordsCount').textContent = t('words.count', { n: w.length });
    $('#wordsList').innerHTML = w.length ? w.map(x => `<div class="clay word-card"><div class="word-main"><div class="word-text">${esc(x.word)}</div>${x.reading ? `<div class="word-reading">${esc(x.reading)}</div>` : ''}<div class="word-meaning">${esc(x.meaning)}</div></div><button type="button" class="icon-btn is-danger" data-edit-only data-del-word="${x.id}" aria-label="${esc(t('diary.delete'))}">${ICONS.get('trash')}</button></div>`).join('') : `<div class="empty">${ICONS.stickers.dango}<p>${esc(t('words.empty'))}</p></div>`;
    renderPractice();
  }
  function renderPractice() {
    const w = Store.state.words; const area = $('#practiceArea');
    if (w.length < 3) { area.innerHTML = `<p class="muted">${esc(t('words.practiceEmpty'))}</p>`; return; }
    if (!practice.order.length || practice.order.some(id => !w.find(x => x.id === id))) shufflePractice();
    const cur = w.find(x => x.id === practice.order[practice.i]) || w[0];
    area.innerHTML = `<button type="button" class="flashcard" id="flashcard" aria-live="polite">${practice.flipped ? `<div><div class="fc-back"><strong>${esc(cur.reading || cur.word)}</strong><br>${esc(cur.meaning)}</div></div>` : `<div class="fc-front">${esc(cur.word)}</div>`}<span class="fc-hint">${esc(t('words.tapFlip'))} · ${practice.i + 1}/${practice.order.length}</span></button>
      <div class="fc-nav"><button type="button" class="btn btn-ghost" id="fcPrev">${ICONS.get('chevronLeft')}<span>${esc(t('words.prev'))}</span></button><button type="button" class="btn btn-soft" id="fcShuffle">${ICONS.get('refresh')}<span>${esc(t('words.shuffle'))}</span></button><button type="button" class="btn btn-ghost" id="fcNext"><span>${esc(t('words.next'))}</span>${ICONS.get('chevronRight')}</button></div>`;
    $('#flashcard').onclick = () => { practice.flipped = !practice.flipped; renderPractice(); };
    $('#fcNext').onclick = () => { practice.i = (practice.i + 1) % practice.order.length; practice.flipped = false; renderPractice(); };
    $('#fcPrev').onclick = () => { practice.i = (practice.i - 1 + practice.order.length) % practice.order.length; practice.flipped = false; renderPractice(); };
    $('#fcShuffle').onclick = () => { shufflePractice(); renderPractice(); };
  }
  function shufflePractice() { const ids = Store.state.words.map(x => x.id); for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; } practice = { order: ids, i: 0, flipped: false }; }
  $('#wordForm').addEventListener('submit', ev => {
    ev.preventDefault();
    const word = $('#wordText').value.trim();
    if (!word) { $('#wordError').textContent = t('words.needWord'); $('#wordError').hidden = false; $('#wordText').setAttribute('aria-invalid', 'true'); $('#wordText').focus(); return; }
    $('#wordError').hidden = true; $('#wordText').removeAttribute('aria-invalid');
    Store.addWord({ word, reading: $('#wordReading').value, meaning: $('#wordMeaning').value });
    ev.target.reset(); $('#wordText').focus();
    toast(t('words.added')); renderWords(); renderHome();
    if (Store.state.github.autosync) autoPush();
  });
  $('#wordsList').addEventListener('click', async ev => { const b = ev.target.closest('[data-del-word]'); if (!b) return; if (await confirmDlg(t('diary.delete'), t('words.deleteConfirm'))) { Store.deleteWord(b.dataset.delWord); renderWords(); renderHome(); } });

  /* ---------- SETTINGS ---------- */
  function renderSettings() {
    const s = Store.state;
    $('#profileName').value = s.profile.name; $('#profileLang').value = s.profile.lang; $('#petalsToggle').checked = s.profile.petals;
    $('#themeGrid').innerHTML = THEMES.map(([k, c, label]) => `<button type="button" class="theme-card ${k === s.profile.theme ? 'is-active' : ''}" data-theme="${k}"><span class="swatch" style="background:${c}"></span><span>${label}</span></button>`).join('');
    $('#themeDots').innerHTML = THEMES.map(([k, c, label]) => `<button type="button" class="theme-dot ${k === s.profile.theme ? 'is-active' : ''}" data-theme="${k}" style="background:${c}" aria-label="${label}" title="${label}"></button>`).join('');
    const g = s.github; $('#ghOwner').value = g.owner; $('#ghRepo').value = g.repo; $('#ghBranch').value = g.branch; $('#ghPath').value = g.path; $('#ghToken').value = g.token; $('#ghAutosync').checked = g.autosync;
    setSyncStatus(g.lastSync ? `${t('settings.gh.lastSync')}: ${fmtTime(g.lastSync)}` : `${t('settings.gh.lastSync')}: ${t('settings.gh.never')}`);
    $('#snapList').innerHTML = s.snapshots.length ? s.snapshots.map((sn, i) => `<li><span>${esc(fmtTime(sn.at))} · ${sn.entries.length} / ${sn.words.length}</span><button type="button" class="btn btn-soft" data-restore="${i}">${esc(t('settings.restore'))}</button></li>`).join('') : `<li class="muted">${esc(t('settings.snapEmpty'))}</li>`;
    $('#storageInfo').textContent = t('settings.storage', { kb: Store.storageKB() });
    renderLockCard();
  }
  $('#profileName').addEventListener('change', ev => { Store.setProfile({ name: ev.target.value.trim() || 'レイハーネ' }); renderHome(); toast(t('settings.saved')); });
  $('#profileLang').addEventListener('change', ev => { Store.setProfile({ lang: ev.target.value }); applyLang(ev.target.value); });
  $('#langSelect').addEventListener('change', ev => { Store.setProfile({ lang: ev.target.value }); applyLang(ev.target.value); });
  $('#petalsToggle').addEventListener('change', ev => { Store.setProfile({ petals: ev.target.checked }); renderPetals(ev.target.checked); });
  document.addEventListener('click', ev => { const b = ev.target.closest('.theme-card, .theme-dot'); if (!b) return; Store.setProfile({ theme: b.dataset.theme }); applyTheme(b.dataset.theme); if (b.dataset.theme === 'yozora') { Store.markEarned(['night']); renderHome(); } });
  $('#snapList').addEventListener('click', async ev => { const b = ev.target.closest('[data-restore]'); if (!b) return; const sn = Store.state.snapshots[+b.dataset.restore]; if (!sn) return; if (await confirmDlg(t('settings.restore'), t('settings.restoreConfirm'), { danger: false })) { const n = Store.merge({ entries: sn.entries, words: sn.words }); toast(t('settings.imported', { n })); renderAll(); } });

  // export / import
  $('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(Store.exportPayload(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `reyhane-diary-${Store.todayISO()}.json`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast(t('settings.exported'));
  });
  $('#importFile').addEventListener('change', async ev => {
    const file = ev.target.files[0]; ev.target.value = ''; if (!file) return;
    try {
      const payload = Store.parsePayload(JSON.parse(await file.text()));
      if (!payload) throw new Error('bad');
      if (await confirmDlg(t('settings.importTitle'), t('settings.importConfirm', { n: payload.entries.length }), { danger: false })) { const n = Store.merge(payload); toast(t('settings.imported', { n })); renderAll(); }
    } catch (e) { toast(t('settings.importBad'), { type: 'err' }); }
  });

  // GitHub
  function ghCfgFromForm() { return { owner: $('#ghOwner').value.trim(), repo: $('#ghRepo').value.trim(), branch: $('#ghBranch').value.trim() || 'main', path: $('#ghPath').value.trim() || 'data/diary.json', token: $('#ghToken').value.trim(), autosync: $('#ghAutosync').checked }; }
  function setSyncStatus(msg, cls = '') { const el = $('#ghStatus'); el.textContent = msg; el.className = 'sync-status ' + cls; }
  function ghErrorMsg(e) { const map = { auth: 'settings.gh.auth', notfound: 'settings.gh.notfound', conflict: 'settings.gh.conflict', missing: 'settings.gh.missing' }; return map[e.code] ? t(map[e.code]) : t('settings.gh.error', { msg: e.message || '' }); }
  $('#ghTokenToggle').addEventListener('click', () => { const i = $('#ghToken'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; $('#ghTokenToggle').innerHTML = ICONS.get(show ? 'eyeOff' : 'eye'); });
  $('#ghSaveBtn').addEventListener('click', () => { Store.setGithub(ghCfgFromForm()); toast(t('settings.saved')); });
  $('#ghAutosync').addEventListener('change', () => Store.setGithub({ autosync: $('#ghAutosync').checked }));
  async function doPush(silent) {
    const cfg = ghCfgFromForm(); Store.setGithub(cfg);
    if (!GitHubSync.ok(cfg)) { setSyncStatus(t('settings.gh.missing'), 'is-err'); if (!silent) toast(t('settings.gh.missing'), { type: 'err' }); return; }
    const btn = $('#ghPushBtn'); btn.setAttribute('aria-busy', 'true'); setSyncStatus(t('settings.gh.pushing'));
    try { await GitHubSync.push(cfg, Store.exportPayload()); Store.setGithub({ lastSync: Store.nowISO() }); setSyncStatus(`${t('settings.gh.pushed')} · ${fmtTime(Store.state.github.lastSync)}`, 'is-ok'); if (!silent) toast(t('settings.gh.pushed')); }
    catch (e) { console.error(e); setSyncStatus(ghErrorMsg(e), 'is-err'); toast(ghErrorMsg(e), { type: 'err' }); }
    finally { btn.removeAttribute('aria-busy'); }
  }
  async function doPull() {
    const cfg = ghCfgFromForm(); Store.setGithub(cfg);
    if (!GitHubSync.ok(cfg)) { setSyncStatus(t('settings.gh.missing'), 'is-err'); toast(t('settings.gh.missing'), { type: 'err' }); return; }
    const btn = $('#ghPullBtn'); btn.setAttribute('aria-busy', 'true'); setSyncStatus(t('settings.gh.pulling'));
    try {
      const json = await GitHubSync.pull(cfg);
      const payload = json && Store.parsePayload(json);
      if (!payload) { setSyncStatus(t('settings.gh.nothing')); toast(t('settings.gh.nothing')); return; }
      const n = Store.merge(payload); Store.setGithub({ lastSync: Store.nowISO() });
      setSyncStatus(t('settings.gh.pulled', { n }), 'is-ok'); toast(t('settings.gh.pulled', { n })); renderAll();
    } catch (e) { console.error(e); setSyncStatus(ghErrorMsg(e), 'is-err'); toast(ghErrorMsg(e), { type: 'err' }); }
    finally { btn.removeAttribute('aria-busy'); }
  }
  $('#ghPushBtn').addEventListener('click', () => doPush(false));
  $('#ghPullBtn').addEventListener('click', doPull);
  const autoPush = debounce(() => { if (GitHubSync.ok(Store.state.github)) doPush(true); }, 1500);

  // wipe
  $('#wipeBtn').addEventListener('click', async () => { if (await confirmDlg(t('settings.wipeTitle'), t('settings.wipeConfirm'))) { Store.wipe(); resetWriteForm(); renderAll(); toast(t('settings.wiped')); } });

  /* ---------- Editor lock ---------- */
  function applyLockUI() {
    const locked = !Auth.canEdit();
    document.documentElement.dataset.locked = locked ? '1' : '';
    const btn = $('#lockBtn');
    btn.setAttribute('aria-pressed', String(locked));
    btn.querySelector('.lock-ico').innerHTML = ICONS.get(locked ? 'lock' : 'unlock');
    $('#lockLabel').textContent = locked ? t('lock.locked') : t('lock.unlocked');
    btn.title = locked ? t('lock.unlock') : (Auth.hasPassword() ? t('lock.lock') : t('lock.setTitle'));
    $('#lockBanner').hidden = !locked;
  }
  let unlockCallback = null;
  function openUnlock(onSuccess) {
    unlockCallback = onSuccess || null;
    const dlg = $('#dlgUnlock');
    $('#unlockPw').value = ''; $('#unlockError').hidden = true; $('#unlockPw').removeAttribute('aria-invalid');
    $('#unlockHint').hidden = true; $('#unlockHintBtn').hidden = !Auth.hint();
    if (!dlg.open) dlg.showModal();
    setTimeout(() => $('#unlockPw').focus(), 50);
  }
  $('#unlockForm').addEventListener('submit', async ev => {
    ev.preventDefault();
    const btn = $('#unlockSubmit'); btn.setAttribute('aria-busy', 'true');
    const ok = await Auth.unlock($('#unlockPw').value, $('#unlockRemember').checked);
    btn.removeAttribute('aria-busy');
    if (!ok) { $('#unlockError').textContent = t('lock.wrong'); $('#unlockError').hidden = false; $('#unlockPw').setAttribute('aria-invalid', 'true'); $('#unlockPw').select(); return; }
    $('#dlgUnlock').close(); renderAll(); toast(t('lock.unlockedToast'));
    const cb = unlockCallback; unlockCallback = null; if (cb) cb();
  });
  $('#unlockCancel').addEventListener('click', () => { unlockCallback = null; $('#dlgUnlock').close(); });
  $('#unlockHintBtn').addEventListener('click', () => { $('#unlockHint').textContent = Auth.hint(); $('#unlockHint').hidden = false; });
  $('#unlockPwToggle').addEventListener('click', () => { const i = $('#unlockPw'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; $('#unlockPwToggle').innerHTML = ICONS.get(show ? 'eyeOff' : 'eye'); });
  $('#dlgUnlock').addEventListener('click', ev => { if (ev.target === ev.currentTarget) { unlockCallback = null; ev.currentTarget.close(); } });
  function toggleLock() {
    if (!Auth.hasPassword()) { location.hash = '#settings'; setTimeout(() => $('#pwNew').focus(), 100); return; }
    if (Auth.isUnlocked()) { Auth.lock(); renderAll(); if (currentView === 'write') location.hash = '#home'; toast(t('lock.lockedToast')); }
    else openUnlock();
  }
  $('#lockBtn').addEventListener('click', toggleLock);
  $('#bannerUnlockBtn').addEventListener('click', () => openUnlock());
  $('#settingsUnlockBtn').addEventListener('click', () => openUnlock());

  function renderLockCard() {
    const has = Auth.hasPassword(), unlocked = Auth.isUnlocked();
    const st = $('#lockState'); st.textContent = has ? t('lock.hasPw') : t('lock.noPw'); st.className = 'lock-state ' + (has ? 'is-on' : 'is-off');
    $('#pwForm').hidden = has && !unlocked; $('#lockLockedNote').hidden = !(has && !unlocked);
    $('#pwCurrentField').hidden = !has; $('#pwRemoveBtn').hidden = !has;
    $('#pwSaveLabel').textContent = has ? t('lock.change') : t('lock.save');
    $('#pwHint').value = Auth.hint();
  }
  function pwError(msg, field) { $('#pwError').textContent = msg; $('#pwError').hidden = false; if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); } }
  $('#pwForm').addEventListener('submit', async ev => {
    ev.preventDefault();
    $('#pwError').hidden = true; $$('#pwForm input').forEach(i => i.removeAttribute('aria-invalid'));
    const cur = $('#pwCurrent').value, nw = $('#pwNew').value, cf = $('#pwConfirm').value;
    if (Auth.hasPassword() && !(await Auth.verify(cur))) return pwError(t('lock.wrong'), $('#pwCurrent'));
    if (nw.length < 4) return pwError(t('lock.tooShort'), $('#pwNew'));
    if (nw !== cf) return pwError(t('lock.mismatch'), $('#pwConfirm'));
    const btn = $('#pwSaveBtn'); btn.setAttribute('aria-busy', 'true');
    await Auth.setPassword(nw, $('#pwHint').value);
    btn.removeAttribute('aria-busy');
    $('#pwCurrent').value = ''; $('#pwNew').value = ''; $('#pwConfirm').value = '';
    toast(t('lock.saved')); renderAll();
    if (Store.state.github.autosync) autoPush();
  });
  $('#pwRemoveBtn').addEventListener('click', async () => {
    $('#pwError').hidden = true;
    if (!(await Auth.verify($('#pwCurrent').value))) return pwError(t('lock.wrong'), $('#pwCurrent'));
    if (await confirmDlg(t('lock.remove'), t('lock.removeConfirm'))) { Auth.removePassword(); $('#pwCurrent').value = ''; toast(t('lock.removed')); renderAll(); if (Store.state.github.autosync) autoPush(); }
  });

  /* ---------- Seed from repo data (deployed site, first visit) ---------- */
  async function trySeed() {
    const s = Store.state; if (s.seeded || s.entries.length || location.protocol === 'file:') return;
    try {
      const res = await fetch('data/diary.json', { cache: 'no-store' }); if (!res.ok) return;
      const payload = Store.parsePayload(await res.json()); if (!payload || !payload.entries.length) return;
      if (await confirmDlg(t('seed.title'), t('seed.text', { n: payload.entries.length }), { danger: false })) { Store.merge(payload); renderAll(); }
    } catch (e) { /* offline or no file */ }
    finally { s.seeded = true; Store.save(); }
  }

  /* ---------- Init ---------- */
  function init() {
    const s = Store.state;
    hydrateIcons();
    $('#brandMascot').innerHTML = ICONS.mascot; $('#heroMascot').innerHTML = ICONS.mascot;
    applyTheme(s.profile.theme); renderPetals(s.profile.petals);
    I18N.setLang(s.profile.lang); $('#langSelect').value = s.profile.lang;
    renderNav(); renderAll();
    if (s.draft && !editingId) { fillForm(s.draft); $('#draftNote').textContent = t('write.draft'); } else resetWriteForm();
    window.addEventListener('hashchange', route); route();
    Store.subscribe(() => { $('#storageInfo').textContent = t('settings.storage', { kb: Store.storageKB() }); });
    window.addEventListener('offline', () => toast(t('offline')));
    reducedMotion.addEventListener?.('change', () => renderPetals(Store.state.profile.petals));
    trySeed();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
