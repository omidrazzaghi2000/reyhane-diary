/* Where the shared diary database lives. Visitors read data/diary.json from this site;
   the editor (with a token) reads and writes it through the GitHub API.
   On *.github.io the owner/repo are derived from the URL automatically. */
(function () {
  const def = { owner: 'omidrazzaghi2000', repo: 'reyhane-diary', branch: 'main', path: 'data/diary.json' };
  const m = location.hostname.match(/^([^.]+)\.github\.io$/);
  if (m) {
    const seg = location.pathname.split('/').filter(Boolean)[0];
    if (seg && !seg.endsWith('.html')) { def.owner = m[1]; def.repo = seg; }
  }
  window.CONFIG = def;
})();
