/* Auth — editor lock. A password (salted, iterated SHA-256) gates writing/editing.
   Without a password set, the app is open. The hash is stored in Store.state.lock and
   travels with exports / GitHub sync, so a device that restores the diary is locked too.
   The lock lives in the shared data file (data/diary.json) so every device sees the same lock.
   This is a UI lock for a kid's diary; the real write credential is the GitHub token. */
(function () {
  const SESSION_KEY = 'reyhane.diary.unlock.session';
  const REMEMBER_KEY = 'reyhane.diary.unlock.remember';
  const ITER = 2000;

  /* --- SHA-256: WebCrypto when available (https/localhost), tiny JS fallback otherwise --- */
  const enc = s => new TextEncoder().encode(s);
  const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  async function sha256(str) {
    if (window.crypto && crypto.subtle) return hex(await crypto.subtle.digest('SHA-256', enc(str)));
    return sha256js(str);
  }
  function sha256js(ascii) {
    const bytes = enc(ascii); const K = [];
    for (let i = 0, p = 2; i < 64; p++) { let isPrime = true; for (let f = 2; f * f <= p; f++) if (p % f === 0) { isPrime = false; break; } if (isPrime) { K[i++] = (Math.pow(p, 1 / 3) * 4294967296) | 0; } }
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const l = bytes.length; const padded = new Uint8Array(((l + 9 + 63) >> 6) << 6); padded.set(bytes); padded[l] = 0x80;
    const dv = new DataView(padded.buffer); dv.setUint32(padded.length - 4, l * 8 >>> 0); dv.setUint32(padded.length - 8, Math.floor(l * 8 / 4294967296));
    const rotr = (x, n) => (x >>> n) | (x << (32 - n)); const w = new Int32Array(64);
    for (let off = 0; off < padded.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) { const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3); const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) { const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25); const ch = (e & f) ^ (~e & g); const t1 = (h + S1 + ch + K[i] + w[i]) | 0; const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22); const maj = (a & b) ^ (a & c) ^ (b & c); const t2 = (S0 + maj) | 0; h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0; }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
  }
  async function derive(password, salt, iter = ITER) {
    let h = await sha256(salt + ':' + password);
    for (let i = 1; i < iter; i++) h = await sha256(h + salt);
    return h;
  }
  const randomSalt = () => { const a = new Uint8Array(12); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => a[i] = Math.random() * 256); return hex(a.buffer); };

  const lock = () => Store.data.lock;
  const get = (store, key) => { try { return store.getItem(key); } catch (e) { return null; } };
  const set = (store, key, v) => { try { v == null ? store.removeItem(key) : store.setItem(key, v); } catch (e) {} };

  const Auth = {
    hasPassword() { return !!(lock() && lock().hash); },
    isUnlocked() {
      if (!this.hasPassword()) return true;
      const h = lock().hash;
      return get(sessionStorage, SESSION_KEY) === h || get(localStorage, REMEMBER_KEY) === h;
    },
    canEdit() { return this.isUnlocked(); },
    async verify(password) {
      const l = lock(); if (!l) return true;
      return (await derive(password, l.salt, l.iter || ITER)) === l.hash;
    },
    async unlock(password, remember) {
      if (!(await this.verify(password))) return false;
      set(sessionStorage, SESSION_KEY, lock().hash);
      if (remember) set(localStorage, REMEMBER_KEY, lock().hash);
      return true;
    },
    lock() { set(sessionStorage, SESSION_KEY, null); set(localStorage, REMEMBER_KEY, null); },
    async setPassword(password, hint) {
      const salt = randomSalt(); const hash = await derive(password, salt, ITER);
      Store.setLock({ salt, hash, hint: String(hint || '').trim().slice(0, 80), iter: ITER, setAt: Store.nowISO() });
      set(sessionStorage, SESSION_KEY, hash); set(localStorage, REMEMBER_KEY, null);
    },
    refresh() { /* after data reload: keep unlocked only if the stored token matches the current hash */ },
    removePassword() { Store.setLock(null); this.lock(); },
    hint() { return (lock() && lock().hint) || ''; },
  };
  window.Auth = Auth;
})();
