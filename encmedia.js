/* UbicoID · vídeos e PDFs cifrados: decifra sob demanda com a chave da sessão. */
(function () {
  const ROOT = document.currentScript.dataset.root || '', KEY = 'ubicoid_k';
  const es = (document.documentElement.lang || '').toLowerCase().startsWith('es');
  const T = es ? { play: 'Reproducir video', load: 'Cargando…', fail: 'No se pudo abrir', out: 'Salir' } : { play: 'Reproduzir vídeo', load: 'Carregando…', fail: 'Não foi possível abrir', out: 'Sair' };
  const enc = t => new TextEncoder().encode(t);
  let keyP = null;
  const key = () => keyP || (keyP = crypto.subtle.importKey('raw', Uint8Array.from(atob(sessionStorage.getItem(KEY) || ''), c => c.charCodeAt(0)), { name: 'AES-GCM' }, false, ['decrypt']));
  const cache = new Map();
  function blobOf(id, type) {
    if (!cache.has(id)) cache.set(id, (async () => {
      const r = await fetch(ROOT + 'data/' + id + '.bin'); if (!r.ok) throw new Error('rede');
      const all = new Uint8Array(await r.arrayBuffer());
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12), additionalData: enc('ubicoid-' + id) }, await key(), all.slice(12));
      return URL.createObjectURL(new Blob([plain], { type }));
    })().catch(e => { cache.delete(id); throw e; }));
    return cache.get(id);
  }
  const local = s => s && !/^(blob:|data:|https?:|mailto:|#)/i.test(s);
  /* vídeos */
  function arm(v) {
    const s = v.getAttribute('src');
    if (!local(s) || !/\.mp4$/i.test(s)) return;
    const id = s.split('/').pop(); v.dataset.enc = id; v.removeAttribute('src'); try { v.load(); } catch (_) {}
    const host = v.parentElement; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    let b = host.querySelector(':scope > .enc-play');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.className = 'enc-play';
      b.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;display:inline-flex;align-items:center;gap:10px;font:700 15px/1 Geist,system-ui,sans-serif;padding:14px 20px;border-radius:999px;border:0;background:#FF6A1F;color:#0A0D13;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.5)';
      host.appendChild(b);
      b.addEventListener('click', async () => {
        const vid = b.__v, id = vid.dataset.enc; b.disabled = true; b.textContent = T.load;
        try { const url = await blobOf(id, 'video/mp4'); vid.src = url; b.remove(); vid.play().catch(() => {}); }
        catch (e) { b.disabled = false; b.textContent = T.fail; }
      });
    }
    b.__v = v; b.disabled = false; b.textContent = '▶  ' + T.play;
  }
  document.querySelectorAll('video').forEach(arm);
  new MutationObserver(ms => ms.forEach(m => { if (m.target.tagName === 'VIDEO') arm(m.target); })).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['src'] });
  /* PDFs */
  document.addEventListener('click', async e => {
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href'); if (!local(h) || !/\.pdf$/i.test(h)) return;
    e.preventDefault();
    const w = window.open('', '_blank');
    try { const url = await blobOf(h.split('/').pop(), 'application/pdf'); if (w) w.location.href = url; else location.href = url; }
    catch (err) { if (w) w.close(); alert(T.fail); }
  }, true);
  /* sair */
  const out = document.createElement('button'); out.type = 'button'; out.textContent = T.out;
  out.style.cssText = 'position:fixed;left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:95;font:600 12px/1 Geist,system-ui,sans-serif;color:#F3F1EC;background:rgba(18,22,33,.9);border:1px solid #2E3647;border-radius:999px;padding:10px 14px;cursor:pointer';
  out.addEventListener('click', () => { try { sessionStorage.removeItem(KEY); } catch (_) {} location.reload(); });
  document.body.appendChild(out);
})();
