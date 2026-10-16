/* UbicoID · Portal do Cidadão — modo demonstração.
   Simula a API /cidadao/api dentro do navegador, para ver o app sem servidor.
   Os dados ficam só neste navegador; nada é enviado a lugar nenhum. */
(function () {
  'use strict';

  // Mapa: recorte do centro de Ciudad del Este publicado junto com a página.
  const LIM = { norte: -25.487909825592315, oeste: -54.635009765625, sul: -25.527571660479637, leste: -54.591064453125 };
  window.UID_MAPA = {
    url: 'tiles/{z}/{x}/{y}.png',
    inicio: [-25.5095, -54.6111, 15],
    limites: [[LIM.sul, LIM.oeste], [LIM.norte, LIM.leste]],
    opcoes: { minZoom: 13, maxNativeZoom: 16, maxZoom: 18, bounds: [[LIM.sul, LIM.oeste], [LIM.norte, LIM.leste]] },
  };

  // Mesmas zonas e códigos do servidor (src/zonas.ts e src/idGenerator.ts).
  const ZONAS = [
    ['Ciudad del Este', 'CDE', -25.509, -54.611], ['Presidente Franco', 'PFR', -25.562, -54.611], ['Hernandarias', 'HER', -25.405, -54.638],
    ['Minga Guazú', 'MGZ', -25.475, -54.81], ['Asunción', 'ASU', -25.282, -57.635], ['Lambaré', 'LAM', -25.346, -57.606],
    ['Fernando de la Mora', 'FDM', -25.32, -57.54], ['San Lorenzo', 'SLO', -25.34, -57.509], ['Luque', 'LUQ', -25.27, -57.487],
    ['Capiatá', 'CAP', -25.355, -57.445], ['Limpio', 'LIM', -25.166, -57.486], ['Mariano Roque Alonso', 'MRA', -25.208, -57.532],
    ['Ñemby', 'NEM', -25.394, -57.535], ['Villa Hayes', 'VHA', -25.095, -57.524], ['Encarnación', 'ENC', -27.331, -55.866],
    ['Pedro Juan Caballero', 'PJC', -22.547, -55.733], ['Concepción', 'CON', -23.406, -57.434], ['San Pedro del Ycuamandiyú', 'SPY', -24.092, -57.077],
    ['Caacupé', 'CCP', -25.386, -57.14], ['Villarrica', 'VIL', -25.75, -56.436], ['Coronel Oviedo', 'COV', -25.447, -56.44],
    ['Caazapá', 'CAZ', -26.195, -56.368], ['San Juan Bautista', 'SJB', -26.669, -57.146], ['Paraguarí', 'PAR', -25.62, -57.147],
    ['Pilar', 'PIL', -26.857, -58.3], ['Salto del Guairá', 'SDG', -24.063, -54.307], ['Filadelfia', 'FIL', -22.35, -60.03], ['Fuerte Olimpo', 'FOL', -21.041, -57.873],
  ];
  function zonaPorCoordenadas(lat, lng) {
    if (lat < -27.7 || lat > -19.2 || lng < -62.7 || lng > -54.2) return null;
    const rad = Math.PI / 180;
    let melhor = null;
    for (const [zona, cod, zl, zg] of ZONAS) {
      const a = Math.sin(((zl - lat) * rad) / 2) ** 2 + Math.cos(lat * rad) * Math.cos(zl * rad) * Math.sin(((zg - lng) * rad) / 2) ** 2;
      const km = 6371 * 2 * Math.asin(Math.sqrt(a));
      if (!melhor || km < melhor.km) melhor = { zona, cod, km };
    }
    return melhor && melhor.km <= 40 ? melhor : null;
  }
  // Formato novo: UID-<CIDADE><REGIÃO><NÚMERO>, ex. UID-CDEA1234 (mesmas regras de src/idGenerator.ts e src/zonas.ts).
  // Região = anel de distância ao centro da zona (até 3 km, 3 a 10 km, acima) x setor da bússola (N, NE, L, SE, S, SO, O, NO).
  const REGIOES = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  function regiaoDaZona(cod, lat, lng) {
    const z = ZONAS.find((x) => x[1] === cod);
    if (!z) return 'A';
    const rad = Math.PI / 180, zl = z[2], zg = z[3];
    const a = Math.sin(((zl - lat) * rad) / 2) ** 2 + Math.cos(lat * rad) * Math.cos(zl * rad) * Math.sin(((zg - lng) * rad) / 2) ** 2;
    const km = 6371 * 2 * Math.asin(Math.sqrt(a));
    const anel = km < 3 ? 0 : km < 10 ? 1 : 2;
    const dx = (lng - zg) * Math.cos(zl * rad), dy = lat - zl;
    const rumo = km === 0 ? 0 : (Math.atan2(dx, dy) / rad + 360) % 360;
    return REGIOES[anel * 8 + Math.floor(((rumo + 22.5) % 360) / 45)];
  }
  const numero4 = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
  function normalizarCodigo(entrada) {
    const bruto = String(entrada || '').trim().toUpperCase();
    const m = bruto.replace(/[^A-Z0-9]/g, '').match(/^UID([A-Z]{3})([A-HJ-NP-Z])(\d{4})$/);
    return m ? `UID-${m[1]}${m[2]}${m[3]}` : bruto.replace(/\s+/g, '');
  }

  function normalizarTelefone(e) {
    let d = String(e || '').replace(/[\s\-().]/g, '');
    if (d.startsWith('+')) d = d.slice(1);
    if (!/^\d+$/.test(d)) return null;
    if (d.startsWith('595')) d = d.slice(3); else if (d.startsWith('0')) d = d.slice(1);
    return /^9\d{8}$/.test(d) ? '+595' + d : null;
  }

  // ---------- armazenamento (localStorage, com plano B em memória) ----------
  const CHAVE = 'ubicoid-demo-v3';
  let memoria = null;
  function ler() {
    if (memoria) return memoria;
    try { memoria = JSON.parse(localStorage.getItem(CHAVE)) || null; } catch (e) { memoria = null; }
    return (memoria = memoria || { cidadaos: {}, sessao: null, uids: {}, codigo: null });
  }
  function gravar() { try { localStorage.setItem(CHAVE, JSON.stringify(memoria)); } catch (e) { /* segue em memória */ } }

  const NIVEIS = ['PRIVADO', 'RED_FAST_DELIVERY', 'INFRAESTRUCTURA_PUBLICA'];

  // Lojas parceiras autorizadas para a demonstração. No sistema real a lista vem do cadastro de lojas da UbicoID.
  const LOJAS = [
    { id: '7b1e0c1a-0001-4000-8000-000000000001', nome: 'Cellshop', cidade: 'Ciudad del Este' },
    { id: '7b1e0c1a-0002-4000-8000-000000000002', nome: 'Shopping China', cidade: 'Ciudad del Este' },
    { id: '7b1e0c1a-0003-4000-8000-000000000003', nome: 'e-lojita', cidade: 'Ciudad del Este' },
    { id: '7b1e0c1a-0004-4000-8000-000000000004', nome: 'Nissei', cidade: 'Ciudad del Este' },
    { id: '7b1e0c1a-0005-4000-8000-000000000005', nome: 'Casa B.O.', cidade: 'Ciudad del Este' },
  ].sort((a, b) => a.nome.localeCompare(b.nome, 'es'));

  function dvRuc(base) {
    let total = 0, k = 2;
    for (let i = base.length - 1; i >= 0; i--) { if (k > 11) k = 2; total += Number(base[i]) * k; k++; }
    const r = total % 11; return r > 1 ? 11 - r : 0;
  }
  function normalizarRuc(e) {
    const m = String(e || '').replace(/[\s.]/g, '').match(/^(\d{3,9})-?(\d)$/);
    if (!m || /^0+$/.test(m[1])) return null;
    return dvRuc(m[1]) === Number(m[2]) ? `${m[1]}-${m[2]}` : null;
  }
  const TERMOS = '2026-10-15';

  function perfil(c) {
    return { telefone: c.telefone, nome: c.nome, idioma: c.idioma, termosAceitos: c.termos === TERMOS, termosAceitosEm: c.termosEm, criadoEm: c.criadoEm,
      ruc: c.ruc || null, rucVinculado: !!c.rucVinculado, rucUidPrincipal: c.rucUidPrincipal || null };
  }
  function resp(status, corpo, tipo) {
    if (status === 204) return new Response(null, { status });
    return new Response(tipo ? corpo : JSON.stringify(corpo), { status, headers: { 'Content-Type': tipo || 'application/json' } });
  }
  const erro = (status, msg, codigo) => resp(status, codigo ? { error: msg, codigo } : { error: msg });

  // ---------- "servidor" ----------
  function api(metodo, caminho, corpo) {
    const db = ler();
    const eu = db.sessao && db.cidadaos[db.sessao];

    if (metodo === 'POST' && caminho === '/codigo') {
      const tel = normalizarTelefone(corpo.telefone);
      if (!tel) return erro(400, corpo.idioma === 'pt' ? 'Número de celular paraguaio inválido (ex.: 0981 123 456).' : 'Número de celular paraguayo inválido (ej.: 0981 123 456).');
      db.codigo = { tel, codigo: String(Math.floor(Math.random() * 1e6)).padStart(6, '0'), tentativas: 0 };
      gravar();
      mostrarCodigo(db.codigo.codigo, corpo.idioma);
      return resp(202, { enviado: true });
    }
    if (metodo === 'POST' && caminho === '/sesion') {
      const tel = normalizarTelefone(corpo.telefone);
      const c = db.codigo;
      if (!tel || !c || c.tel !== tel || c.tentativas >= 5 || c.codigo !== corpo.codigo) {
        if (c) c.tentativas++;
        gravar();
        return erro(400, corpo.idioma === 'pt' ? 'Código inválido ou vencido. Peça um novo código.' : 'Código inválido o vencido. Pedí un código nuevo.');
      }
      db.codigo = null;
      let novo = false;
      if (!db.cidadaos[tel]) { db.cidadaos[tel] = { telefone: tel, nome: null, idioma: corpo.idioma || 'es', termos: null, termosEm: null, criadoEm: new Date().toISOString() }; novo = true; }
      db.sessao = tel; gravar(); esconderCodigo();
      return resp(201, { cidadao: perfil(db.cidadaos[tel]), novo });
    }
    if (!eu) return erro(401, 'Sesión ausente.');

    if (caminho === '/sesion' && metodo === 'DELETE') { db.sessao = null; gravar(); return resp(204); }
    if (caminho === '/yo') {
      if (metodo === 'GET') return resp(200, perfil(eu));
      if (metodo === 'PATCH') {
        if (corpo.nome !== undefined) eu.nome = (corpo.nome || '').trim() || null;
        if (corpo.idioma) eu.idioma = corpo.idioma;
        if (corpo.aceitarTermos) { eu.termos = TERMOS; eu.termosEm = new Date().toISOString(); }
        gravar(); return resp(200, perfil(eu));
      }
      if (metodo === 'DELETE') {
        for (const u of Object.values(db.uids)) if (u.dono === eu.telefone) { u.dono = null; u.exclusaoPendente = true; u.lojas = []; }
        delete db.cidadaos[eu.telefone]; db.sessao = null; gravar(); return resp(204);
      }
    }
    if (caminho === '/yo/ruc' && metodo === 'PUT') {
      if (corpo.ruc === null) { eu.ruc = null; eu.rucVinculado = false; eu.rucUidPrincipal = null; gravar(); return resp(200, perfil(eu)); }
      const ruc = normalizarRuc(corpo.ruc);
      if (!ruc) return erro(400, 'RUC inválido. Revisá el número y el dígito verificador (ej.: 1234567-9).');
      let principal = null;
      if (corpo.vinculado) {
        const u = db.uids[corpo.uidPrincipal];
        if (!u || u.dono !== eu.telefone) return erro(400, 'Elegí qué UbicoID queda vinculado al RUC.');
        if (u.exclusaoPendente) return erro(400, 'Este UbicoID tiene la eliminación pedida.');
        principal = u.deliveryId;
      }
      eu.ruc = ruc; eu.rucVinculado = !!corpo.vinculado; eu.rucUidPrincipal = principal; gravar();
      return resp(200, perfil(eu));
    }
    const meus = () => Object.values(db.uids).filter((u) => u.dono === eu.telefone).sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
    const publico = (u) => { const { dono, lojas, ...r } = u; return r; };
    if (caminho === '/uids' && metodo === 'GET') return resp(200, meus().map(publico));
    if (caminho === '/uids' && metodo === 'POST') {
      if (eu.termos !== TERMOS) return erro(403, 'Aceptá los términos antes de crear un UbicoID.', 'TERMOS_PENDENTES');
      if (!NIVEIS.includes(corpo.nivelConsentimento)) return erro(400, 'Elegí quién puede ver tu punto.');
      if (meus().length >= 10) return erro(429, 'Límite de 10 UbicoID por persona.');
      const z = zonaPorCoordenadas(corpo.lat, corpo.lng);
      if (!z) return erro(422, 'Fuera del área atendida.', 'FORA_DA_AREA');
      const reg = regiaoDaZona(z.cod, corpo.lat, corpo.lng);
      let id; do { id = `UID-${z.cod}${reg}${numero4()}`; } while (db.uids[id]);
      db.uids[id] = {
        deliveryId: id, dono: eu.telefone, apelido: String(corpo.apelido || 'Casa').trim(), zona: z.zona, lat: corpo.lat, lng: corpo.lng,
        referenciasAcesso: String(corpo.referenciasAcesso || '').trim(), unidade: corpo.unidade || null, nivelConsentimento: corpo.nivelConsentimento,
        nivelConfianca: 0, entregasConfirmadas: 0, criadoEm: new Date().toISOString(), exclusaoPendente: false,
      };
      gravar(); return resp(201, publico(db.uids[id]));
    }
    if (caminho === '/lojas' && metodo === 'GET') return resp(200, LOJAS);
    const ml = caminho.match(/^\/uids\/([^/]+)\/lojas(?:\/([^/]+))?$/);
    if (ml) {
      const u = db.uids[normalizarCodigo(decodeURIComponent(ml[1]))];
      if (!u || u.dono !== eu.telefone) return erro(404, 'UbicoID no encontrado en tu cuenta.');
      u.lojas = u.lojas || [];
      const ver = (c) => { const l = LOJAS.find((x) => x.id === c.lojaId) || { nome: '—', cidade: '' }; return { lojaId: c.lojaId, lojaNome: l.nome, lojaCidade: l.cidade, referenciaCliente: c.ref, compartilhadoEm: c.em, origem: 'CIDADAO' }; };
      if (metodo === 'GET' && !ml[2]) return resp(200, u.lojas.map(ver));
      if (metodo === 'POST' && !ml[2]) {
        if (u.exclusaoPendente) return erro(400, 'Este UbicoID tiene la eliminación pedida.');
        if (!LOJAS.find((x) => x.id === corpo.lojaId)) return erro(404, 'Tienda no encontrada.');
        let c = u.lojas.find((x) => x.lojaId === corpo.lojaId);
        if (!c) { c = { lojaId: corpo.lojaId, ref: '', em: new Date().toISOString() }; u.lojas.push(c); }
        if (corpo.referenciaCliente) c.ref = String(corpo.referenciaCliente).trim();
        gravar(); return resp(201, ver(c));
      }
      if (metodo === 'DELETE' && ml[2]) {
        const antes = u.lojas.length;
        u.lojas = u.lojas.filter((x) => x.lojaId !== decodeURIComponent(ml[2]));
        if (u.lojas.length === antes) return erro(404, 'Este UbicoID no está compartido con esa tienda.');
        gravar(); return resp(204);
      }
    }
    const m = caminho.match(/^\/uids\/([^/]+)(\/consentimiento|\/eliminacion)?$/);
    if (m) {
      const u = db.uids[normalizarCodigo(decodeURIComponent(m[1]))];
      if (!u || u.dono !== eu.telefone) return erro(404, 'UbicoID no encontrado en tu cuenta.');
      if (!m[2] && metodo === 'GET') return resp(200, publico(u));
      if (!m[2] && metodo === 'PATCH') {
        if (corpo.apelido) u.apelido = corpo.apelido.trim();
        if (corpo.referenciasAcesso) u.referenciasAcesso = corpo.referenciasAcesso.trim();
        gravar(); return resp(200, publico(u));
      }
      if (m[2] === '/consentimiento') {
        if (NIVEIS.indexOf(corpo.nivelConsentimento) <= NIVEIS.indexOf(u.nivelConsentimento)) return erro(400, 'El nivel solo puede subir.');
        u.nivelConsentimento = corpo.nivelConsentimento; gravar(); return resp(200, publico(u));
      }
      if (m[2] === '/eliminacion') {
        u.exclusaoPendente = true; u.lojas = [];
        if (eu.rucUidPrincipal === u.deliveryId) { eu.rucVinculado = false; eu.rucUidPrincipal = null; }
        gravar(); return resp(201, { deliveryId: u.deliveryId, status: 'PENDENTE' }); }
    }
    return erro(404, 'Ruta inexistente.');
  }

  const fetchOriginal = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    const u = typeof url === 'string' ? url : url.url;
    if (!u.startsWith('api/')) return fetchOriginal(url, opts);
    const metodo = (opts && opts.method) || 'GET';
    let corpo = {};
    try { corpo = opts && opts.body ? JSON.parse(opts.body) : {}; } catch (e) { corpo = {}; }
    // Pequena espera, como numa rede real.
    return new Promise((ok) => setTimeout(() => ok(api(metodo, u.slice(3), corpo)), 220));
  };

  // ---------- QR: o app pede /api/uids/ID/qr.svg; aqui ele é gerado no próprio navegador ----------
  function qrDataUri(texto) {
    if (typeof qrcode !== 'function') return '';
    const q = qrcode(0, 'M'); q.addData(texto); q.make();
    const svg = q.createSvgTag({ cellSize: 6, margin: 1, scalable: true });
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/fill="#000000"/g, 'fill="#0A0D13"'));
  }
  function trocarQrs(raiz) {
    raiz.querySelectorAll('img[src^="api/uids/"]').forEach((img) => {
      const m = img.getAttribute('src').match(/^api\/uids\/([^/]+)\/qr\.svg$/);
      if (m) img.src = qrDataUri(decodeURIComponent(m[1]));
    });
  }

  // ---------- termos: abre o texto numa camada, sem sair da página ----------
  async function abrirTermos() {
    const fundo = document.createElement('div');
    fundo.className = 'dlg-fundo';
    fundo.innerHTML = '<div class="dlg card termos" role="dialog" aria-modal="true" aria-label="Términos"><div class="termos-corpo">…</div><button type="button" class="btn primary">OK</button></div>';
    document.body.appendChild(fundo);
    const fechar = () => fundo.remove();
    fundo.querySelector('button').addEventListener('click', fechar);
    fundo.addEventListener('click', (e) => { if (e.target === fundo) fechar(); });
    fundo.querySelector('button').focus();
    try {
      const html = await (await fetchOriginal('terminos.html')).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('a.btn').forEach((a) => a.remove());
      fundo.querySelector('.termos-corpo').innerHTML = doc.querySelector('main').innerHTML;
    } catch (e) { fundo.querySelector('.termos-corpo').textContent = 'No se pudo abrir el texto.'; }
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="terminos.html"]');
    if (a) { e.preventDefault(); abrirTermos(); }
  });

  // ---------- faixa de demonstração e "SMS" na tela ----------
  const TXT = {
    es: { faixa: 'Demostración: los datos quedan solo en este navegador.', sms: 'SMS simulado · tu código es', reiniciar: 'Reiniciar demo' },
    pt: { faixa: 'Demonstração: os dados ficam só neste navegador.', sms: 'SMS simulado · seu código é', reiniciar: 'Reiniciar demo' },
  };
  const lang = () => (document.documentElement.lang || 'es').startsWith('pt') ? 'pt' : 'es';
  let faixa, sms;
  function montarFaixa() {
    faixa = document.createElement('div');
    faixa.className = 'demo-faixa';
    faixa.innerHTML = `<span></span><button type="button" class="link">${TXT[lang()].reiniciar}</button>`;
    faixa.querySelector('button').addEventListener('click', () => {
      try { localStorage.removeItem(CHAVE); } catch (e) { /* ok */ }
      memoria = null; location.hash = '#/entrar'; location.reload();
    });
    document.body.insertBefore(faixa, document.body.firstChild);
    sms = document.createElement('div');
    sms.className = 'demo-sms'; sms.setAttribute('role', 'status'); sms.hidden = true;
    document.body.appendChild(sms);
    atualizarFaixa();
  }
  function atualizarFaixa() {
    if (!faixa) return;
    faixa.querySelector('span').textContent = TXT[lang()].faixa;
    faixa.querySelector('button').textContent = TXT[lang()].reiniciar;
  }
  function mostrarCodigo(codigo, idioma) {
    if (!sms) return;
    sms.innerHTML = `<small>${TXT[idioma === 'pt' ? 'pt' : 'es'].sms}</small><b class="mono">${codigo}</b>`;
    sms.hidden = false;
  }
  function esconderCodigo() { if (sms) sms.hidden = true; }

  document.addEventListener('DOMContentLoaded', () => {
    montarFaixa();
    const main = document.getElementById('main');
    new MutationObserver(() => trocarQrs(main)).observe(main, { childList: true, subtree: true });
    new MutationObserver(atualizarFaixa).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  });
})();
