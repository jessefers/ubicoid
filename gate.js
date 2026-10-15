/* UbicoID · acesso restrito: o conteúdo em data/ está cifrado (AES-GCM 256, chave PBKDF2-SHA256 derivada de usuário e senha). */
(function () {
  const me = document.currentScript, ROOT = me.dataset.root || '', PAGE = me.dataset.page, KEY = 'ubicoid_k';
  const enc = t => new TextEncoder().encode(t);
  const b64d = t => Uint8Array.from(atob(t.trim()), c => c.charCodeAt(0));
  const b64e = u => btoa(String.fromCharCode(...u));
  const $ = id => document.getElementById(id);
  let META = null;
  async function derive(user, pass) {
    if (!META) { const r = await fetch(ROOT + 'data/meta.json', { cache: 'no-store' }); if (!r.ok) throw new Error('rede'); META = await r.json(); }
    const base = await crypto.subtle.importKey('raw', enc(user + ':' + pass), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64d(META.salt), iterations: META.iter }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
  }
  async function decrypt(key, id) {
    const r = await fetch(ROOT + 'data/' + id + '.bin'); if (!r.ok) throw new Error('rede');
    const all = new Uint8Array(await r.arrayBuffer());
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12), additionalData: enc('ubicoid-' + id) }, key, all.slice(12));
  }
  async function show(key) {
    let html = new TextDecoder().decode(await decrypt(key, PAGE));
    const hook = '<script src="' + ROOT + 'encmedia.js" data-root="' + ROOT + '"><\/script>';
    const i = html.toLowerCase().lastIndexOf('</body>');
    html = i >= 0 ? html.slice(0, i) + hook + html.slice(i) : html + hook;
    document.open(); document.write(html); document.close();
  }
  async function start() {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) { const key = await crypto.subtle.importKey('raw', b64d(saved), { name: 'AES-GCM' }, true, ['decrypt']); await show(key); return; }
    } catch (e) { try { sessionStorage.removeItem(KEY); } catch (_) {} }
    $('gate').hidden = false; $('u').focus();
  }
  $('gate').addEventListener('submit', async e => {
    e.preventDefault();
    const u = $('u').value.trim(), p = $('p').value, b = $('go');
    $('err').textContent = ''; b.disabled = true; b.textContent = $('gate').dataset.wait;
    try {
      const key = await derive(u, p);
      await decrypt(key, PAGE);
      try { sessionStorage.setItem(KEY, b64e(new Uint8Array(await crypto.subtle.exportKey('raw', key)))); } catch (_) {}
      await show(key);
    } catch (err) {
      $('err').textContent = err && err.message === 'rede' ? $('gate').dataset.net : $('gate').dataset.bad;
      $('p').value = ''; $('p').focus(); b.disabled = false; b.textContent = $('gate').dataset.go;
    }
  });
  start();
})();
