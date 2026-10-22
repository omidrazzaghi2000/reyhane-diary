/* Sync — the GitHub repo is the database.
   Visitors: read data/diary.json from this site (served by GitHub Pages, no token).
   Editor (device with a token): read + write through the GitHub Contents API.
   Every save = fetch latest remote → merge (tombstones) → PUT with the remote sha. */
(function () {
  const API = 'https://api.github.com';
  const utf8ToB64 = s => btoa(unescape(encodeURIComponent(s)));
  const b64ToUtf8 = b => decodeURIComponent(escape(atob(b.replace(/\n/g, ''))));
  class GHError extends Error { constructor(code, msg) { super(msg); this.code = code; } }

  const cfg = () => Store.github;
  const hasToken = () => !!(cfg().owner && cfg().repo && cfg().token && cfg().path);
  const headers = () => ({ Accept: 'application/vnd.github+json', Authorization: `Bearer ${cfg().token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' });
  const url = path => `${API}/repos/${encodeURIComponent(cfg().owner)}/${encodeURIComponent(cfg().repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;

  async function handle(res) {
    if (res.ok) return res.status === 204 ? null : res.json();
    let msg = res.statusText; try { const j = await res.json(); msg = j.message || msg; } catch (e) {}
    if (res.status === 401 || res.status === 403) throw new GHError('auth', msg);
    if (res.status === 404) throw new GHError('notfound', msg);
    if (res.status === 409 || res.status === 422) throw new GHError('conflict', msg);
    throw new GHError('error', msg);
  }
  async function apiGet(path) {
    const res = await fetch(`${url(path)}?ref=${encodeURIComponent(cfg().branch || 'main')}&t=${Date.now()}`, { headers: headers(), cache: 'no-store' });
    if (res.status === 404) return null;
    const j = await handle(res);
    let json = null; try { json = JSON.parse(b64ToUtf8(j.content || '')); } catch (e) {}
    return { sha: j.sha, json };
  }
  async function apiPut(path, obj, message, sha) {
    const body = { message, content: utf8ToB64(JSON.stringify(obj, null, 2)), branch: cfg().branch || 'main' };
    if (sha) body.sha = sha;
    return handle(await fetch(url(path), { method: 'PUT', headers: headers(), body: JSON.stringify(body) }));
  }
  async function siteGet() {
    const res = await fetch('data/diary.json', { cache: 'no-store' });
    if (!res.ok) throw new GHError('error', 'HTTP ' + res.status);
    return res.json();
  }

  /* Load the shared diary. Prefers the API (fresh) when a token is set, else the site copy. */
  async function load() {
    if (hasToken()) {
      try {
        const f = await apiGet(cfg().path);
        const d = Store.normalizeData(f ? f.json : null) || Store.emptyData();
        Store.setData(d, { remoteSha: f ? f.sha : null, source: 'api', loadedAt: Store.nowISO() });
        return d;
      } catch (e) { console.warn('api load failed, falling back to site copy', e); if (e.code === 'auth') throw e; }
    }
    const d = Store.normalizeData(await siteGet()) || Store.emptyData();
    Store.setData(d, { remoteSha: null, source: 'site', loadedAt: Store.nowISO() });
    return d;
  }

  /* Save: merge with the latest remote so nothing is lost, then write (+ dated backup copy). */
  async function save(message) {
    if (!hasToken()) throw new GHError('missing', 'no token');
    const st = Store.state; st.saving = true; Store.emit();
    try {
      const local = Store.clone(Store.data);
      for (let attempt = 0; attempt < 2; attempt++) {
        const remote = await apiGet(cfg().path);
        const remoteData = Store.normalizeData(remote ? remote.json : null) || Store.emptyData();
        const merged = Store.mergeData(remoteData, local);
        merged.updatedAt = Store.nowISO();
        const payload = { ...merged, savedAt: merged.updatedAt };
        try {
          const res = await apiPut(cfg().path, payload, message || `diary: ${merged.entries.length} entries, ${merged.words.length} words`, remote ? remote.sha : undefined);
          Store.setData(merged, { remoteSha: res && res.content ? res.content.sha : null, source: 'api', loadedAt: Store.nowISO() });
          Store.setGithub({ lastSync: Store.nowISO() });
          backupCopy(payload).catch(e => console.warn('backup copy failed', e));
          return merged;
        } catch (e) { if (e.code === 'conflict' && attempt === 0) continue; throw e; }
      }
    } finally { st.saving = false; Store.emit(); }
  }
  async function backupCopy(payload) {
    const date = new Date().toISOString().slice(0, 10);
    const p = cfg().path; const dir = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '';
    const path = (dir ? dir + '/' : '') + `backups/diary-${date}.json`;
    const existing = await apiGet(path);
    await apiPut(path, payload, `diary: backup ${date}`, existing ? existing.sha : undefined);
  }

  window.Sync = { load, save, hasToken, GHError };
})();
