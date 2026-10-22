/* GitHub sync — uses a repository file as the diary "database" via the Contents API.
   Push: writes <path> and a dated copy under backups/. Pull: reads <path> and merges. */
(function () {
  const API = 'https://api.github.com';

  const utf8ToB64 = s => btoa(unescape(encodeURIComponent(s)));
  const b64ToUtf8 = b => decodeURIComponent(escape(atob(b.replace(/\n/g, ''))));

  function headers(cfg) {
    return { Accept: 'application/vnd.github+json', Authorization: `Bearer ${cfg.token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
  }
  function url(cfg, path) {
    return `${API}/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  }
  function ok(cfg) { return !!(cfg.owner && cfg.repo && cfg.token && cfg.path); }

  class GHError extends Error { constructor(code, msg) { super(msg); this.code = code; } }
  async function handle(res) {
    if (res.ok) return res.status === 204 ? null : res.json();
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.message || msg; } catch (e) {}
    if (res.status === 401 || res.status === 403) throw new GHError('auth', msg);
    if (res.status === 404) throw new GHError('notfound', msg);
    if (res.status === 409 || res.status === 422) throw new GHError('conflict', msg);
    throw new GHError('error', msg);
  }

  async function getFile(cfg, path) {
    const res = await fetch(`${url(cfg, path)}?ref=${encodeURIComponent(cfg.branch || 'main')}`, { headers: headers(cfg) });
    if (res.status === 404) return null;
    const j = await handle(res);
    let json = null;
    try { json = JSON.parse(b64ToUtf8(j.content || '')); } catch (e) { json = null; }
    return { sha: j.sha, json };
  }

  async function putFile(cfg, path, obj, message) {
    const existing = await getFile(cfg, path);
    const body = { message, content: utf8ToB64(JSON.stringify(obj, null, 2)), branch: cfg.branch || 'main' };
    if (existing) body.sha = existing.sha;
    const res = await fetch(url(cfg, path), { method: 'PUT', headers: headers(cfg), body: JSON.stringify(body) });
    return handle(res);
  }

  async function push(cfg, payload) {
    if (!ok(cfg)) throw new GHError('missing', 'missing config');
    const date = new Date().toISOString().slice(0, 10);
    await putFile(cfg, cfg.path, payload, `diary: sync ${payload.entries.length} entries (${date})`);
    // dated backup copy next to the main file (best effort)
    const dir = cfg.path.includes('/') ? cfg.path.slice(0, cfg.path.lastIndexOf('/')) : '';
    const backupPath = (dir ? dir + '/' : '') + `backups/diary-${date}.json`;
    try { await putFile(cfg, backupPath, payload, `diary: backup ${date}`); } catch (e) { console.warn('backup copy failed', e); }
    return true;
  }

  async function pull(cfg) {
    if (!ok(cfg)) throw new GHError('missing', 'missing config');
    const file = await getFile(cfg, cfg.path);
    if (!file) return null;
    return file.json;
  }

  window.GitHubSync = { push, pull, ok, GHError };
})();
