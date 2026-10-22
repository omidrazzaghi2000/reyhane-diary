/* Store — the diary lives in ONE shared JSON file in the GitHub repo (data/diary.json).
   In memory here; loaded/saved by Sync. localStorage only keeps device settings
   (theme, language, GitHub token, remembered unlock) — never the diary itself. */
(function () {
  const SETTINGS_KEY = 'reyhane.diary.settings.v2';
  const GH_KEY = 'reyhane.diary.github.v2';
  const DRAFT_KEY = 'reyhane.diary.draft.v2';

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const nowISO = () => new Date().toISOString();
  function todayISO(d = new Date()) { const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }
  const clone = o => JSON.parse(JSON.stringify(o));
  const loadLS = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === 'object' ? { ...d, ...v } : { ...d }; } catch (e) { return { ...d }; } };
  const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  const emptyData = () => ({ app: 'reyhane-diary', version: 2, profile: { name: 'レイハーネ' }, entries: [], words: [], deleted: [], lock: null, updatedAt: null });

  const state = {
    data: emptyData(),
    settings: loadLS(SETTINGS_KEY, { theme: 'sakura', lang: 'ja', petals: true }),
    github: loadLS(GH_KEY, { owner: CONFIG.owner, repo: CONFIG.repo, branch: CONFIG.branch, path: CONFIG.path, token: '', lastSync: null }),
    remoteSha: null, loaded: false, source: null, loadedAt: null, dirty: false, saving: false,
  };
  const listeners = new Set();
  const emit = () => listeners.forEach(fn => { try { fn(state); } catch (e) { console.error(e); } });

  /* ---- normalize / merge ---- */
  function normalizeEntry(e) {
    return {
      id: e.id || uid(), date: e.date || todayISO(), title: String(e.title || '').trim(), body: String(e.body || ''),
      mood: e.mood || 'happy', weather: e.weather || 'sunny',
      tags: Array.isArray(e.tags) ? e.tags.map(t => String(t).trim()).filter(Boolean) : [],
      favorite: !!e.favorite, createdAt: e.createdAt || nowISO(), updatedAt: e.updatedAt || e.createdAt || nowISO(),
    };
  }
  function normalizeWord(w) { return { id: w.id || uid(), word: String(w.word || '').trim(), reading: String(w.reading || '').trim(), meaning: String(w.meaning || '').trim(), createdAt: w.createdAt || nowISO(), updatedAt: w.updatedAt || w.createdAt || nowISO() }; }
  function normalizeData(obj) {
    if (!obj || typeof obj !== 'object') return null;
    if (!Array.isArray(obj.entries) && !Array.isArray(obj.words)) return null;
    const d = emptyData();
    d.entries = (obj.entries || []).map(normalizeEntry);
    d.words = (obj.words || []).filter(w => w && w.word).map(normalizeWord);
    d.deleted = Array.isArray(obj.deleted) ? obj.deleted.filter(x => x && x.id).map(x => ({ id: String(x.id), at: x.at || nowISO(), kind: x.kind || 'entry' })) : [];
    d.lock = obj.lock && typeof obj.lock.hash === 'string' && typeof obj.lock.salt === 'string' ? obj.lock : null;
    if (obj.profile && obj.profile.name) d.profile.name = String(obj.profile.name).slice(0, 30);
    d.updatedAt = obj.updatedAt || null;
    sortEntries(d);
    return d;
  }
  function sortEntries(d) { d.entries.sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt)); }

  /* Merge two data sets: newest updatedAt wins per id; tombstones remove items unless the item was updated after deletion. */
  function mergeData(a, b) {
    const out = emptyData();
    const tomb = new Map();
    [...(a.deleted || []), ...(b.deleted || [])].forEach(t => { const k = t.kind + ':' + t.id; if (!tomb.has(k) || tomb.get(k).at < t.at) tomb.set(k, t); });
    const pick = (list, kind) => {
      const m = new Map();
      list.forEach(x => { const cur = m.get(x.id); if (!cur || (x.updatedAt || '') > (cur.updatedAt || '')) m.set(x.id, x); });
      return [...m.values()].filter(x => { const t = tomb.get(kind + ':' + x.id); return !t || (x.updatedAt || '') > t.at; });
    };
    out.entries = pick([...a.entries, ...b.entries], 'entry');
    out.words = pick([...a.words, ...b.words], 'word');
    out.deleted = [...tomb.values()].filter(t => t.at > new Date(Date.now() - 180 * 864e5).toISOString()); // keep tombstones 180 days
    const newer = (a.lock && a.lock.setAt || '') >= (b.lock && b.lock.setAt || '') ? a : b;
    out.lock = newer.lock || a.lock || b.lock || null;
    out.profile.name = (a.updatedAt || '') >= (b.updatedAt || '') ? (a.profile.name || b.profile.name) : (b.profile.name || a.profile.name);
    out.updatedAt = [a.updatedAt, b.updatedAt].filter(Boolean).sort().pop() || null;
    sortEntries(out);
    return out;
  }

  /* ---- mutations (in memory; call Sync.save() to persist) ---- */
  const touch = () => { state.data.updatedAt = nowISO(); state.dirty = true; emit(); };
  function setData(d, meta = {}) { state.data = d; Object.assign(state, meta); state.loaded = true; state.dirty = false; emit(); }
  function addEntry(data) { const e = normalizeEntry({ ...data, id: undefined, createdAt: undefined, updatedAt: undefined }); state.data.entries.push(e); sortEntries(state.data); touch(); return e; }
  function updateEntry(id, data) { const i = state.data.entries.findIndex(e => e.id === id); if (i < 0) return null; const e = normalizeEntry({ ...state.data.entries[i], ...data, id, updatedAt: nowISO() }); state.data.entries[i] = e; sortEntries(state.data); touch(); return e; }
  function deleteEntry(id) { const i = state.data.entries.findIndex(e => e.id === id); if (i < 0) return null; const [r] = state.data.entries.splice(i, 1); state.data.deleted.push({ id, at: nowISO(), kind: 'entry' }); touch(); return r; }
  function restoreEntry(entry) { state.data.deleted = state.data.deleted.filter(t => !(t.kind === 'entry' && t.id === entry.id)); state.data.entries.push({ ...entry, updatedAt: nowISO() }); sortEntries(state.data); touch(); }
  function getEntry(id) { return state.data.entries.find(e => e.id === id) || null; }
  function addWord(w) { const word = normalizeWord({ ...w, id: undefined }); state.data.words.unshift(word); touch(); return word; }
  function deleteWord(id) { const i = state.data.words.findIndex(w => w.id === id); if (i < 0) return null; const [r] = state.data.words.splice(i, 1); state.data.deleted.push({ id, at: nowISO(), kind: 'word' }); touch(); return r; }
  function setLock(lock) { state.data.lock = lock && lock.hash ? lock : null; touch(); }
  function setName(name) { state.data.profile.name = String(name || '').trim().slice(0, 30) || 'レイハーネ'; touch(); }
  function wipe() { state.data.entries.forEach(e => state.data.deleted.push({ id: e.id, at: nowISO(), kind: 'entry' })); state.data.words.forEach(w => state.data.deleted.push({ id: w.id, at: nowISO(), kind: 'word' })); state.data.entries = []; state.data.words = []; touch(); }
  function importData(obj) { const inc = normalizeData(obj); if (!inc) return null; const before = state.data.entries.length + state.data.words.length; state.data = mergeData(state.data, inc); touch(); return state.data.entries.length + state.data.words.length - before; }

  /* ---- device settings ---- */
  function setSettings(patch) { Object.assign(state.settings, patch); saveLS(SETTINGS_KEY, state.settings); emit(); }
  function setGithub(patch) { Object.assign(state.github, patch); saveLS(GH_KEY, state.github); emit(); }
  function setDraft(d) { try { d ? sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)) : sessionStorage.removeItem(DRAFT_KEY); } catch (e) {} }
  function getDraft() { try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY)); } catch (e) { return null; } }

  function exportPayload() { return { ...clone(state.data), exportedAt: nowISO() }; }

  window.Store = {
    state, get data() { return state.data; }, get settings() { return state.settings; }, get github() { return state.github; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }, emit,
    uid, todayISO, nowISO, clone, emptyData, normalizeData, mergeData, setData,
    addEntry, updateEntry, deleteEntry, restoreEntry, getEntry, addWord, deleteWord, setLock, setName, wipe, importData,
    setSettings, setGithub, setDraft, getDraft, exportPayload,
  };
})();
