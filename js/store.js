/* Store — single source of truth, persisted in localStorage.
   Shape: { version, profile, entries[], words[], github, snapshots[], draft, seeded } */
(function () {
  const KEY = 'reyhane.diary.v1';
  const MAX_SNAPSHOTS = 5;

  const defaults = () => ({
    version: 1,
    profile: { name: 'レイハーネ', theme: 'sakura', lang: 'ja', petals: true, themeSet: false },
    entries: [],
    words: [],
    github: { owner: '', repo: '', branch: 'main', path: 'data/diary.json', token: '', autosync: false, lastSync: null },
    snapshots: [],
    draft: null,
    seeded: false,
    earned: [],
  });

  const listeners = new Set();
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      const d = defaults();
      return {
        ...d, ...parsed,
        profile: { ...d.profile, ...(parsed.profile || {}) },
        github: { ...d.github, ...(parsed.github || {}) },
        entries: Array.isArray(parsed.entries) ? parsed.entries : [],
        words: Array.isArray(parsed.words) ? parsed.words : [],
        snapshots: Array.isArray(parsed.snapshots) ? parsed.snapshots : [],
        earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      };
    } catch (e) {
      console.warn('store: could not parse, starting fresh', e);
      return defaults();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // quota exceeded → drop snapshots and retry once
      state.snapshots = [];
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e2) { console.error('store: cannot save', e2); }
    }
    listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const nowISO = () => new Date().toISOString();
  function todayISO(d = new Date()) {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  /* Daily snapshot before first mutation of the day */
  function snapshot(force) {
    const today = todayISO();
    const last = state.snapshots[0];
    if (!force && last && last.date === today) return;
    if (!state.entries.length && !state.words.length) return;
    state.snapshots.unshift({ date: today, at: nowISO(), entries: JSON.parse(JSON.stringify(state.entries)), words: JSON.parse(JSON.stringify(state.words)) });
    state.snapshots = state.snapshots.slice(0, MAX_SNAPSHOTS);
  }

  /* ---- Entries ---- */
  function normalizeEntry(e) {
    return {
      id: e.id || uid(),
      date: e.date || todayISO(),
      title: String(e.title || '').trim(),
      body: String(e.body || ''),
      mood: e.mood || 'happy',
      weather: e.weather || 'sunny',
      tags: Array.isArray(e.tags) ? e.tags.map(t => String(t).trim()).filter(Boolean) : [],
      favorite: !!e.favorite,
      createdAt: e.createdAt || nowISO(),
      updatedAt: e.updatedAt || nowISO(),
    };
  }
  function sortEntries() {
    state.entries.sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt));
  }
  function addEntry(data) {
    snapshot();
    const e = normalizeEntry({ ...data, id: undefined, createdAt: undefined, updatedAt: undefined });
    state.entries.push(e); sortEntries(); state.draft = null; save(); return e;
  }
  function updateEntry(id, data) {
    const i = state.entries.findIndex(e => e.id === id);
    if (i < 0) return null;
    snapshot();
    const e = normalizeEntry({ ...state.entries[i], ...data, id, updatedAt: nowISO() });
    state.entries[i] = e; sortEntries(); state.draft = null; save(); return e;
  }
  function deleteEntry(id) {
    const i = state.entries.findIndex(e => e.id === id);
    if (i < 0) return null;
    snapshot();
    const [removed] = state.entries.splice(i, 1); save(); return removed;
  }
  function restoreEntry(entry) { state.entries.push(entry); sortEntries(); save(); }
  function getEntry(id) { return state.entries.find(e => e.id === id) || null; }

  /* ---- Words ---- */
  function addWord(w) {
    snapshot();
    const word = { id: uid(), word: String(w.word || '').trim(), reading: String(w.reading || '').trim(), meaning: String(w.meaning || '').trim(), createdAt: nowISO() };
    state.words.unshift(word); save(); return word;
  }
  function deleteWord(id) { const i = state.words.findIndex(w => w.id === id); if (i < 0) return null; const [r] = state.words.splice(i, 1); save(); return r; }

  /* ---- Profile / settings ---- */
  function setProfile(patch) { Object.assign(state.profile, patch); save(); }
  function setGithub(patch) { Object.assign(state.github, patch); save(); }
  function setDraft(draft) { state.draft = draft; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function markEarned(ids) { let changed = false; ids.forEach(id => { if (!state.earned.includes(id)) { state.earned.push(id); changed = true; } }); if (changed) save(); return changed; }

  /* ---- Export / import / merge ---- */
  function exportPayload() {
    return { app: 'reyhane-diary', version: 1, exportedAt: nowISO(), profile: { name: state.profile.name }, entries: state.entries, words: state.words };
  }
  function parsePayload(obj) {
    if (!obj || typeof obj !== 'object') return null;
    const entries = Array.isArray(obj.entries) ? obj.entries.map(normalizeEntry) : [];
    const words = Array.isArray(obj.words) ? obj.words.filter(w => w && w.word).map(w => ({ id: w.id || uid(), word: String(w.word), reading: String(w.reading || ''), meaning: String(w.meaning || ''), createdAt: w.createdAt || nowISO() })) : [];
    if (!Array.isArray(obj.entries) && !Array.isArray(obj.words)) return null;
    return { entries, words, profile: obj.profile || null };
  }
  /* newest updatedAt wins for same id */
  function merge(payload) {
    snapshot(true);
    const byId = new Map(state.entries.map(e => [e.id, e]));
    let added = 0;
    payload.entries.forEach(e => {
      const cur = byId.get(e.id);
      if (!cur) { byId.set(e.id, e); added++; }
      else if ((e.updatedAt || '') > (cur.updatedAt || '')) { byId.set(e.id, e); added++; }
    });
    state.entries = [...byId.values()]; sortEntries();
    const wIds = new Set(state.words.map(w => w.id));
    const wKeys = new Set(state.words.map(w => w.word + '|' + w.meaning));
    payload.words.forEach(w => { if (!wIds.has(w.id) && !wKeys.has(w.word + '|' + w.meaning)) { state.words.push(w); added++; } });
    if (payload.profile && payload.profile.name && !state.entries.length) state.profile.name = payload.profile.name;
    save();
    return added;
  }
  function wipe() {
    const keep = { profile: state.profile, github: state.github };
    state = { ...defaults(), ...keep, seeded: true };
    save();
  }
  function storageKB() { try { return Math.round((localStorage.getItem(KEY) || '').length * 2 / 1024); } catch (e) { return 0; } }

  window.Store = {
    get state() { return state; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    save, uid, todayISO, nowISO,
    addEntry, updateEntry, deleteEntry, restoreEntry, getEntry,
    addWord, deleteWord,
    setProfile, setGithub, setDraft, markEarned,
    exportPayload, parsePayload, merge, wipe, snapshot, storageKB,
  };
})();
