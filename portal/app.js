/* UbicoID · Portal do Cidadão — app web sem etapa de build.
   Telas por hash (#/entrar, #/codigo, #/bienvenida, #/inicio, #/nuevo, #/uid/ID, #/cuenta).
   A sessão vive num cookie HttpOnly; este script nunca vê o token. */
(function () {
  'use strict';

  const T = {
    es: {
      skip: 'Ir al contenido',
      entrarTitulo: 'Tu dirección exacta, <em>en un código.</em>',
      entrarLead: 'Creá tu UbicoID gratis. Con tu número de celular, sin contraseña.',
      celular: 'Número de celular', celularAyuda: 'Te mandamos un código de 6 dígitos.',
      recibirCodigo: 'Recibir código',
      codigoTitulo: 'Ingresá el código',
      codigoLead: (t) => `Lo enviamos al ${t}. Vence en 10 minutos.`,
      codigo: 'Código de 6 dígitos', verificar: 'Entrar', otroNumero: 'Usar otro número', reenviar: 'Reenviar código',
      reenviado: 'Código reenviado.',
      bienvenidaTitulo: '¡Bienvenido a <em>UbicoID</em>!',
      bienvenidaLead: 'Antes de crear tu primer UbicoID, contanos cómo llamarte y aceptá los términos.',
      nombre: 'Tu nombre', opcional: '(opcional)',
      acepto: 'Leí y acepto los <a href="terminos.html" target="_blank" rel="noopener">términos de uso y privacidad</a>.',
      continuar: 'Continuar', aceptaTerminos: 'Para seguir, aceptá los términos.',
      inicioTitulo: (n) => (n ? `Hola, ${n}.` : 'Tus UbicoID'),
      inicioLead: 'Compartí tu código y llegá a donde estás, sin vueltas.',
      nuevo: 'Crear UbicoID', vacioTitulo: 'Todavía no tenés un UbicoID',
      vacioLead: 'Marcá tu punto exacto en el mapa y recibí tu código.',
      cuenta: 'Mi cuenta',
      entregas: (n) => (n === 1 ? '1 entrega confirmada' : `${n} entregas confirmadas`),
      exclusionPendiente: 'Eliminación pedida',
      nuevoTitulo: 'Marcá tu <em>punto exacto</em>',
      nuevoLead: 'Tocá el mapa o arrastrá el pin hasta tu puerta.',
      miUbicacion: 'Usar mi ubicación', ubicando: 'Buscando tu ubicación…',
      sinGps: 'No pudimos usar tu ubicación. Marcá el punto en el mapa.',
      precision: (m) => `Precisión aproximada: ${m} m. Ajustá el pin si hace falta.`,
      apodo: '¿Qué lugar es?', casa: 'Casa', trabajo: 'Trabajo', otro: 'Otro', apodoOtro: 'Nombre del lugar',
      referencias: 'Referencias para llegar',
      referenciasAyuda: 'Ej.: portón negro, frente a la farmacia, timbre 2.',
      unidad: 'Departamento, piso o casa',
      quienVe: '¿Quién puede ver tu punto?',
      nivel: {
        PRIVADO: ['Solo yo', 'Nadie más ve tu punto. Las empresas de entrega no pueden usarlo.'],
        RED_FAST_DELIVERY: ['Empresas de entrega', 'Repartidores de empresas asociadas ven el punto y las referencias para entregarte.'],
        INFRAESTRUCTURA_PUBLICA: ['Público y anónimo', 'Además, el punto entra en mapas y estadísticas sin tu nombre ni tu número.'],
      },
      elegiNivel: 'Elegí quién puede ver tu punto.',
      marcaPunto: 'Marcá tu punto en el mapa.',
      crear: 'Crear mi UbicoID', creado: '¡Listo! Tu UbicoID fue creado.',
      fueraArea: 'Este punto todavía no está en una zona atendida por UbicoID. Probá con un punto dentro de una ciudad.',
      tuCodigo: 'Tu código UbicoID',
      copiar: 'Copiar código', copiado: 'Código copiado.',
      compartir: 'Compartir por WhatsApp',
      compartirTexto: (c) => `Mi dirección UbicoID: ${c} · ¡Acá ko estoy!`,
      qrAlt: (c) => `Código QR del UbicoID ${c}`,
      zona: 'Zona', confianza: 'Confianza', visible: 'Visible para', creadoEn: 'Creado el',
      editar: 'Editar', guardar: 'Guardar', guardado: 'Cambios guardados.',
      ampliar: 'Ampliar quién ve', ampliarLead: 'Podés ampliar quién ve tu punto. Para dejar de compartirlo, pedí la eliminación.',
      ampliarA: (n) => `Pasar a “${n}”`, confirmarAmpliar: (n) => `¿Pasar tu punto a “${n}”? En esta versión no se puede volver atrás.`,
      eliminar: 'Pedir eliminación', confirmarEliminar: '¿Pedir la eliminación de este UbicoID? El equipo UbicoID revisa el pedido.',
      eliminacionPedida: 'Pedido de eliminación registrado.',
      volver: 'Volver',
      cuentaTitulo: 'Mi cuenta', celularCuenta: 'Celular', idioma: 'Idioma',
      salir: 'Cerrar sesión', borrarCuenta: 'Eliminar mi cuenta',
      confirmarBorrar: '¿Eliminar tu cuenta? Borramos tu número y tu nombre, y pedimos la eliminación de todos tus UbicoID.',
      cuentaBorrada: 'Tu cuenta fue eliminada.',
      cancelar: 'Cancelar', confirmar: 'Confirmar',
      error: 'Algo salió mal. Probá de nuevo.', sinConexion: 'Sin conexión. Revisá tu internet.',
      terminos: 'Términos y privacidad', slogan: 'UbicoID: ¡Acá ko estoy!',
      tiendaTitulo: 'Enviar a una tienda',
      tiendaLead: 'Agregá tu UbicoID al registro de la tienda donde comprás. La tienda recibe el código y tu punto para entregarte; nunca tu nombre ni tu número.',
      tiendaBuscar: 'Buscar tienda', tiendaNinguna: 'No encontramos esa tienda en UbicoID.',
      tiendaRef: 'N° de pedido o de cliente en la tienda', tiendaRefAyuda: 'Ayuda a la tienda a reconocer tu compra.',
      tiendaEnviar: 'Enviar a la tienda', tiendaElegi: 'Elegí una tienda de la lista.',
      tiendaEnviado: (n) => `Tu UbicoID fue enviado a ${n}.`,
      tiendaCompartido: 'Compartido con', tiendaQuitar: 'Dejar de compartir',
      tiendaConfirmarQuitar: (n) => `¿Dejar de compartir tu UbicoID con ${n}? La tienda pierde el acceso a tu punto.`,
      tiendaQuitado: 'Listo, la tienda ya no ve tu punto.',
      tiendaBloqueada: 'Este UbicoID tiene la eliminación pedida y ya no se envía a tiendas.',
      viaRuc: 'encontró tu UbicoID por tu RUC',
      rucJunto: (r) => `Tu RUC ${r} va junto con este UbicoID.`,
      rucTitulo: 'RUC y tiendas',
      rucLead: 'Vinculá tu RUC a un UbicoID. Cuando des tu RUC en una tienda asociada, la tienda encuentra tu UbicoID. Y la tienda que recibe tu UbicoID recibe tu RUC para la factura.',
      rucCampo: 'RUC', rucAyuda: 'Con el dígito verificador. Ej.: 1234567-9.',
      rucVincular: 'Vincular mi RUC con mi UbicoID en las tiendas asociadas',
      rucUid: 'UbicoID vinculado al RUC', rucSinUid: 'Primero creá un UbicoID para vincular tu RUC.',
      rucGuardar: 'Guardar RUC', rucBorrar: 'Borrar RUC', rucBorrado: 'RUC borrado.',
      rucEstado: (v) => (v ? 'Vínculo activo' : 'RUC guardado, sin vínculo'),
    },
    pt: {
      skip: 'Ir para o conteúdo',
      entrarTitulo: 'Seu endereço exato, <em>num código.</em>',
      entrarLead: 'Crie seu UbicoID grátis. Com o número do celular, sem senha.',
      celular: 'Número de celular', celularAyuda: 'Enviamos um código de 6 dígitos.',
      recibirCodigo: 'Receber código',
      codigoTitulo: 'Digite o código',
      codigoLead: (t) => `Enviamos para ${t}. Vale por 10 minutos.`,
      codigo: 'Código de 6 dígitos', verificar: 'Entrar', otroNumero: 'Usar outro número', reenviar: 'Reenviar código',
      reenviado: 'Código reenviado.',
      bienvenidaTitulo: 'Boas-vindas ao <em>UbicoID</em>!',
      bienvenidaLead: 'Antes de criar seu primeiro UbicoID, diga como quer ser chamado e aceite os termos.',
      nombre: 'Seu nome', opcional: '(opcional)',
      acepto: 'Li e aceito os <a href="terminos.html" target="_blank" rel="noopener">termos de uso e privacidade</a>.',
      continuar: 'Continuar', aceptaTerminos: 'Para seguir, aceite os termos.',
      inicioTitulo: (n) => (n ? `Olá, ${n}.` : 'Seus UbicoID'),
      inicioLead: 'Compartilhe seu código e a entrega chega onde você está.',
      nuevo: 'Criar UbicoID', vacioTitulo: 'Você ainda não tem um UbicoID',
      vacioLead: 'Marque seu ponto exato no mapa e receba seu código.',
      cuenta: 'Minha conta',
      entregas: (n) => (n === 1 ? '1 entrega confirmada' : `${n} entregas confirmadas`),
      exclusionPendiente: 'Exclusão pedida',
      nuevoTitulo: 'Marque seu <em>ponto exato</em>',
      nuevoLead: 'Toque no mapa ou arraste o pino até a sua porta.',
      miUbicacion: 'Usar minha localização', ubicando: 'Buscando sua localização…',
      sinGps: 'Não conseguimos usar sua localização. Marque o ponto no mapa.',
      precision: (m) => `Precisão aproximada: ${m} m. Ajuste o pino se precisar.`,
      apodo: 'Que lugar é este?', casa: 'Casa', trabajo: 'Trabalho', otro: 'Outro', apodoOtro: 'Nome do lugar',
      referencias: 'Referências para chegar',
      referenciasAyuda: 'Ex.: portão preto, em frente à farmácia, campainha 2.',
      unidad: 'Apartamento, andar ou casa',
      quienVe: 'Quem pode ver o seu ponto?',
      nivel: {
        PRIVADO: ['Só eu', 'Ninguém mais vê seu ponto. As empresas de entrega não podem usá-lo.'],
        RED_FAST_DELIVERY: ['Empresas de entrega', 'Entregadores de empresas parceiras veem o ponto e as referências para entregar.'],
        INFRAESTRUCTURA_PUBLICA: ['Público e anônimo', 'Além disso, o ponto entra em mapas e estatísticas sem seu nome nem seu número.'],
      },
      elegiNivel: 'Escolha quem pode ver o seu ponto.',
      marcaPunto: 'Marque seu ponto no mapa.',
      crear: 'Criar meu UbicoID', creado: 'Pronto! Seu UbicoID foi criado.',
      fueraArea: 'Este ponto ainda não está numa região atendida pelo UbicoID. Tente um ponto dentro de uma cidade.',
      tuCodigo: 'Seu código UbicoID',
      copiar: 'Copiar código', copiado: 'Código copiado.',
      compartir: 'Compartilhar no WhatsApp',
      compartirTexto: (c) => `Meu endereço UbicoID: ${c} · ¡Acá ko estoy!`,
      qrAlt: (c) => `QR code do UbicoID ${c}`,
      zona: 'Zona', confianza: 'Confiança', visible: 'Visível para', creadoEn: 'Criado em',
      editar: 'Editar', guardar: 'Salvar', guardado: 'Alterações salvas.',
      ampliar: 'Ampliar quem vê', ampliarLead: 'Você pode ampliar quem vê seu ponto. Para parar de compartilhar, peça a exclusão.',
      ampliarA: (n) => `Mudar para “${n}”`, confirmarAmpliar: (n) => `Mudar seu ponto para “${n}”? Nesta versão não é possível voltar atrás.`,
      eliminar: 'Pedir exclusão', confirmarEliminar: 'Pedir a exclusão deste UbicoID? A equipe UbicoID revisa o pedido.',
      eliminacionPedida: 'Pedido de exclusão registrado.',
      volver: 'Voltar',
      cuentaTitulo: 'Minha conta', celularCuenta: 'Celular', idioma: 'Idioma',
      salir: 'Sair', borrarCuenta: 'Excluir minha conta',
      confirmarBorrar: 'Excluir sua conta? Apagamos seu número e seu nome, e pedimos a exclusão de todos os seus UbicoID.',
      cuentaBorrada: 'Sua conta foi excluída.',
      cancelar: 'Cancelar', confirmar: 'Confirmar',
      error: 'Algo deu errado. Tente de novo.', sinConexion: 'Sem conexão. Verifique sua internet.',
      terminos: 'Termos e privacidade', slogan: 'UbicoID: ¡Acá ko estoy!',
      tiendaTitulo: 'Enviar para uma loja',
      tiendaLead: 'Adicione seu UbicoID ao cadastro da loja onde você compra. A loja recebe o código e o seu ponto para entregar; nunca seu nome nem seu número.',
      tiendaBuscar: 'Buscar loja', tiendaNinguna: 'Não encontramos essa loja no UbicoID.',
      tiendaRef: 'Nº do pedido ou de cliente na loja', tiendaRefAyuda: 'Ajuda a loja a reconhecer sua compra.',
      tiendaEnviar: 'Enviar para a loja', tiendaElegi: 'Escolha uma loja da lista.',
      tiendaEnviado: (n) => `Seu UbicoID foi enviado para ${n}.`,
      tiendaCompartido: 'Compartilhado com', tiendaQuitar: 'Parar de compartilhar',
      tiendaConfirmarQuitar: (n) => `Parar de compartilhar seu UbicoID com ${n}? A loja perde o acesso ao seu ponto.`,
      tiendaQuitado: 'Pronto, a loja não vê mais o seu ponto.',
      tiendaBloqueada: 'Este UbicoID tem exclusão pedida e não é mais enviado a lojas.',
      viaRuc: 'encontrou seu UbicoID pelo seu RUC',
      rucJunto: (r) => `Seu RUC ${r} vai junto com este UbicoID.`,
      rucTitulo: 'RUC e lojas',
      rucLead: 'Vincule seu RUC a um UbicoID. Quando você informar o RUC numa loja parceira, a loja encontra seu UbicoID. E a loja que recebe seu UbicoID recebe seu RUC para a nota fiscal.',
      rucCampo: 'RUC', rucAyuda: 'Com o dígito verificador. Ex.: 1234567-9.',
      rucVincular: 'Vincular meu RUC ao meu UbicoID nas lojas parceiras',
      rucUid: 'UbicoID vinculado ao RUC', rucSinUid: 'Crie um UbicoID primeiro para vincular seu RUC.',
      rucGuardar: 'Salvar RUC', rucBorrar: 'Apagar RUC', rucBorrado: 'RUC apagado.',
      rucEstado: (v) => (v ? 'Vínculo ativo' : 'RUC salvo, sem vínculo'),
    },
  };

  const NIVEIS = ['PRIVADO', 'RED_FAST_DELIVERY', 'INFRAESTRUCTURA_PUBLICA'];
  const main = document.getElementById('main');
  const toastEl = document.getElementById('toast');
  const state = { lang: initialLang(), yo: null, uids: null, telefone: '' };

  function initialLang() {
    try { const s = localStorage.getItem('uid-lang'); if (s === 'es' || s === 'pt') return s; } catch (e) { /* sem storage */ }
    return (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'es';
  }
  const t = () => T[state.lang];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toast.h);
    toast.h = setTimeout(() => toastEl.classList.remove('on'), 3200);
  }

  async function api(method, path, body) {
    let res;
    try {
      res = await fetch('api' + path, {
        method,
        credentials: 'same-origin',
        headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (e) {
      const err = new Error(t().sinConexion); err.status = 0; throw err;
    }
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || t().error);
      err.status = res.status; err.codigo = data.codigo;
      if (res.status === 401 && !path.startsWith('/codigo') && !path.startsWith('/sesion')) { state.yo = null; go('/entrar'); }
      throw err;
    }
    return data;
  }

  function go(route) { if (location.hash !== '#' + route) location.hash = route; else render(); }

  function setLang(l) {
    state.lang = l;
    try { localStorage.setItem('uid-lang', l); } catch (e) { /* ok */ }
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'es-PY';
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    document.querySelector('.skip').textContent = t().skip;
    if (state.yo && state.yo.idioma !== l) api('PATCH', '/yo', { idioma: l }).then((yo) => { state.yo = yo; }).catch(() => {});
    render();
  }
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  function view(html, focusSel) {
    main.innerHTML = html;
    const f = focusSel && main.querySelector(focusSel);
    (f || main).focus({ preventScroll: false });
    window.scrollTo(0, 0);
  }

  function busy(btn, on) { if (btn) btn.disabled = on; }

  // Confirmação na própria tela (o confirm() do navegador nem sempre aparece,
  // por exemplo dentro de apps e páginas incorporadas).
  function confirmar(msg) {
    return new Promise((resolve) => {
      const volta = document.activeElement;
      const fundo = document.createElement('div');
      fundo.className = 'dlg-fundo';
      fundo.innerHTML = `<div class="dlg card" role="alertdialog" aria-modal="true" aria-labelledby="dlg-msg">
        <p id="dlg-msg">${esc(msg)}</p>
        <div class="row"><button type="button" class="btn ghost" data-r="0">${esc(t().cancelar)}</button>
        <button type="button" class="btn primary" data-r="1">${esc(t().confirmar)}</button></div></div>`;
      function fechar(r) { fundo.remove(); document.removeEventListener('keydown', tecla); if (volta) volta.focus(); resolve(r); }
      function tecla(e) { if (e.key === 'Escape') fechar(false); }
      fundo.addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (b) fechar(b.dataset.r === '1'); else if (e.target === fundo) fechar(false); });
      document.addEventListener('keydown', tecla);
      document.body.appendChild(fundo);
      fundo.querySelector('[data-r="0"]').focus();
    });
  }

  function foot() {
    return `<p class="foot">${esc(t().slogan)} · <a href="terminos.html" target="_blank" rel="noopener">${esc(t().terminos)}</a></p>`;
  }

  function nivelNome(n) { return t().nivel[n][0]; }

  /* ---------------- telas ---------------- */

  function telaEntrar() {
    view(`
      <h1>${t().entrarTitulo}</h1>
      <p class="lead">${esc(t().entrarLead)}</p>
      <form class="card stack" id="f" novalidate>
        <label class="f">${esc(t().celular)}
          <div class="tel"><span aria-hidden="true">+595</span>
            <input type="tel" name="telefone" autocomplete="tel-national" inputmode="tel" placeholder="0981 123 456" required value="${esc(state.telefone)}" aria-describedby="h-tel">
          </div>
          <small id="h-tel">${esc(t().celularAyuda)}</small>
        </label>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary" type="submit">${esc(t().recibirCodigo)}</button>
      </form>${foot()}`, 'input');
    const f = document.getElementById('f');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = f.querySelector('button');
      busy(btn, true);
      state.telefone = f.telefone.value.trim();
      try {
        await api('POST', '/codigo', { telefone: state.telefone, idioma: state.lang });
        go('/codigo');
      } catch (err) {
        document.getElementById('err').textContent = err.message;
      } finally { busy(btn, false); }
    });
  }

  function telaCodigo() {
    if (!state.telefone) return go('/entrar');
    view(`
      <h1>${esc(t().codigoTitulo)}</h1>
      <p class="lead">${esc(t().codigoLead(state.telefone))}</p>
      <form class="card stack" id="f" novalidate>
        <label class="f">${esc(t().codigo)}
          <input class="code" name="codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required>
        </label>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary" type="submit">${esc(t().verificar)}</button>
        <div class="row"><button type="button" class="link" id="reenviar">${esc(t().reenviar)}</button>
        <button type="button" class="link" id="outro">${esc(t().otroNumero)}</button></div>
      </form>${foot()}`, 'input');
    const f = document.getElementById('f');
    f.codigo.addEventListener('input', () => {
      f.codigo.value = f.codigo.value.replace(/\D/g, '').slice(0, 6);
      if (f.codigo.value.length === 6) f.requestSubmit();
    });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type=submit]');
      busy(btn, true);
      try {
        const r = await api('POST', '/sesion', { telefone: state.telefone, codigo: f.codigo.value, idioma: state.lang });
        state.yo = r.cidadao; state.uids = null;
        go(state.yo.termosAceitos ? '/inicio' : '/bienvenida');
      } catch (err) {
        document.getElementById('err').textContent = err.message;
        f.codigo.select();
      } finally { busy(btn, false); }
    });
    document.getElementById('reenviar').addEventListener('click', async () => {
      try { await api('POST', '/codigo', { telefone: state.telefone, idioma: state.lang }); toast(t().reenviado); }
      catch (err) { document.getElementById('err').textContent = err.message; }
    });
    document.getElementById('outro').addEventListener('click', () => go('/entrar'));
  }

  function telaBienvenida() {
    view(`
      <h1>${t().bienvenidaTitulo}</h1>
      <p class="lead">${esc(t().bienvenidaLead)}</p>
      <form class="card stack" id="f" novalidate>
        <label class="f">${esc(t().nombre)} <small>${esc(t().opcional)}</small>
          <input type="text" name="nome" maxlength="80" autocomplete="given-name" value="${esc(state.yo.nome || '')}">
        </label>
        <label class="check"><input type="checkbox" name="termos" required> <span>${t().acepto}</span></label>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary" type="submit">${esc(t().continuar)}</button>
      </form>`, 'input');
    const f = document.getElementById('f');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!f.termos.checked) { document.getElementById('err').textContent = t().aceptaTerminos; return; }
      const btn = f.querySelector('button');
      busy(btn, true);
      try {
        state.yo = await api('PATCH', '/yo', { nome: f.nome.value.trim() || null, aceitarTermos: true, idioma: state.lang });
        go('/nuevo');
      } catch (err) { document.getElementById('err').textContent = err.message; }
      finally { busy(btn, false); }
    });
  }

  async function telaInicio() {
    view('<p class="loading" role="status">…</p>');
    try { state.uids = await api('GET', '/uids'); } catch (err) { return; }
    const lista = state.uids.map((u) => `
      <a class="card uid" href="#/uid/${encodeURIComponent(u.deliveryId)}">
        <b>${esc(u.apelido)}</b><span class="pill ${u.entregasConfirmadas ? 'ok' : ''}">${esc(t().entregas(u.entregasConfirmadas))}</span>
        <span class="mono">${esc(u.deliveryId)}</span>
        <span class="nivel"><span class="pill">${esc(nivelNome(u.nivelConsentimento))}</span>
        ${u.exclusaoPendente ? `<span class="pill warn">${esc(t().exclusionPendiente)}</span>` : ''}</span>
      </a>`).join('');
    view(`
      <h1>${esc(t().inicioTitulo(state.yo.nome))}</h1>
      <p class="lead">${esc(t().inicioLead)}</p>
      ${state.uids.length ? `<div class="uids">${lista}</div>` : `
        <div class="card empty"><img src="icons/simbolo.svg" alt="">
          <h2>${esc(t().vacioTitulo)}</h2><p class="muted">${esc(t().vacioLead)}</p></div>`}
      <div class="stack"><a class="btn primary" href="#/nuevo">${esc(t().nuevo)}</a>
      <a class="btn ghost" href="#/cuenta">${esc(t().cuenta)}</a></div>${foot()}`, 'h1');
  }

  const PIN_SVG = '<svg viewBox="0 0 34 44" aria-hidden="true"><path d="M17 1C8.2 1 1 8 1 16.6 1 28.3 17 43 17 43s16-14.7 16-26.4C33 8 25.8 1 17 1z" fill="#FF6A1F" stroke="#0A0D13" stroke-width="2"/><circle cx="17" cy="16.5" r="6" fill="#0A0D13"/></svg>';

  function pinIcon() {
    return L.divIcon({ className: 'pin', html: PIN_SVG, iconSize: [34, 44], iconAnchor: [17, 44] });
  }

  // Fonte dos blocos do mapa e vista inicial. Em produção, um provedor de
  // mapas contratado pode ser configurado em window.UID_MAPA antes deste script.
  const MAPA = Object.assign({
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    inicio: [-23.6, -58.2, 6],
  }, window.UID_MAPA || {});

  function baseMap(el, opts) {
    const map = L.map(el, Object.assign({ zoomControl: true, attributionControl: true }, opts || {}));
    L.tileLayer(MAPA.url, Object.assign({
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }, MAPA.opcoes || {})).addTo(map);
    if (MAPA.limites) map.setMaxBounds(MAPA.limites);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    return map;
  }

  function telaNuevo() {
    if (!state.yo.termosAceitos) return go('/bienvenida');
    const n = t().nivel;
    view(`
      <h1>${t().nuevoTitulo}</h1>
      <p class="lead">${esc(t().nuevoLead)}</p>
      <div class="map" id="map" role="application" aria-label="Mapa"></div>
      <div class="maptools"><button type="button" class="btn ghost" id="gps">📍 ${esc(t().miUbicacion)}</button>
        <span class="muted" id="gpsmsg" role="status"></span></div>
      <form class="stack" id="f" novalidate>
        <fieldset><legend>${esc(t().apodo)}</legend>
          <div class="chips">
            <label><input type="radio" name="apelido" value="${esc(t().casa)}" checked><span>${esc(t().casa)}</span></label>
            <label><input type="radio" name="apelido" value="${esc(t().trabajo)}"><span>${esc(t().trabajo)}</span></label>
            <label><input type="radio" name="apelido" value="__otro"><span>${esc(t().otro)}</span></label>
          </div>
          <input type="text" name="apelidoOutro" maxlength="40" placeholder="${esc(t().apodoOtro)}" aria-label="${esc(t().apodoOtro)}" hidden>
        </fieldset>
        <label class="f">${esc(t().referencias)}
          <textarea name="referencias" maxlength="500" required aria-describedby="h-ref"></textarea>
          <small id="h-ref">${esc(t().referenciasAyuda)}</small>
        </label>
        <label class="f">${esc(t().unidad)} <small>${esc(t().opcional)}</small>
          <input type="text" name="unidade" maxlength="60">
        </label>
        <fieldset><legend>${esc(t().quienVe)}</legend>
          <div class="opts">${NIVEIS.map((k) => `
            <label class="opt"><input type="radio" name="nivel" value="${k}"><b>${esc(n[k][0])}</b><small>${esc(n[k][1])}</small></label>`).join('')}
          </div>
        </fieldset>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary" type="submit">${esc(t().crear)}</button>
        <a class="btn ghost" href="#/inicio">${esc(t().volver)}</a>
      </form>`, 'h1');

    let ponto = null;
    const map = baseMap('map').setView([MAPA.inicio[0], MAPA.inicio[1]], MAPA.inicio[2]);
    const marker = L.marker([-25.51, -54.61], { draggable: true, icon: pinIcon(), keyboard: true, title: 'UbicoID' });
    let circulo = null;
    function marcar(latlng, zoom) {
      ponto = latlng;
      marker.setLatLng(latlng);
      if (!map.hasLayer(marker)) marker.addTo(map);
      if (zoom) map.setView(latlng, zoom);
    }
    map.on('click', (e) => marcar(e.latlng, Math.max(map.getZoom(), 17)));
    marker.on('dragend', () => { ponto = marker.getLatLng(); });

    const gpsMsg = document.getElementById('gpsmsg');
    function usarGps() {
      if (!navigator.geolocation) { gpsMsg.textContent = t().sinGps; return; }
      gpsMsg.textContent = t().ubicando;
      navigator.geolocation.getCurrentPosition((pos) => {
        const ll = L.latLng(pos.coords.latitude, pos.coords.longitude);
        marcar(ll, 18);
        if (circulo) circulo.remove();
        circulo = L.circle(ll, { radius: pos.coords.accuracy, color: '#FF6A1F', weight: 1, fillOpacity: 0.08 }).addTo(map);
        gpsMsg.textContent = t().precision(Math.round(pos.coords.accuracy));
      }, () => { gpsMsg.textContent = t().sinGps; }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    }
    document.getElementById('gps').addEventListener('click', usarGps);
    usarGps();

    const f = document.getElementById('f');
    f.querySelectorAll('input[name=apelido]').forEach((r) => r.addEventListener('change', () => {
      f.apelidoOutro.hidden = f.apelido.value !== '__otro';
      if (!f.apelidoOutro.hidden) f.apelidoOutro.focus();
    }));
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById('err');
      const nivel = f.querySelector('input[name=nivel]:checked');
      const apelido = f.apelido.value === '__otro' ? f.apelidoOutro.value.trim() : f.apelido.value;
      if (!ponto) { err.textContent = t().marcaPunto; return; }
      if (!nivel) { err.textContent = t().elegiNivel; return; }
      const btn = f.querySelector('button[type=submit]');
      busy(btn, true);
      try {
        const uid = await api('POST', '/uids', {
          lat: Number(ponto.lat.toFixed(6)), lng: Number(ponto.lng.toFixed(6)),
          apelido: apelido || t().casa, referenciasAcesso: f.referencias.value.trim(),
          unidade: f.unidade.value.trim() || undefined, nivelConsentimento: nivel.value,
        });
        toast(t().creado);
        go('/uid/' + encodeURIComponent(uid.deliveryId));
      } catch (e2) {
        err.textContent = e2.codigo === 'FORA_DA_AREA' ? t().fueraArea : e2.message;
      } finally { busy(btn, false); }
    });
  }

  async function telaUid(id) {
    view('<p class="loading" role="status">…</p>');
    let u;
    try { u = await api('GET', '/uids/' + encodeURIComponent(id)); } catch (err) { toast(err.message); return go('/inicio'); }
    const idx = NIVEIS.indexOf(u.nivelConsentimento);
    const maiores = NIVEIS.slice(idx + 1);
    const wa = 'https://wa.me/?text=' + encodeURIComponent(t().compartirTexto(u.deliveryId));
    const data = new Date(u.criadoEm).toLocaleDateString(state.lang === 'pt' ? 'pt-BR' : 'es-PY');
    view(`
      <div class="card hero-uid">
        <p class="muted">${esc(t().tuCodigo)} · ${esc(u.apelido)}</p>
        <p class="code-big" id="code">${esc(u.deliveryId)}</p>
        <div class="qr"><img src="api/uids/${encodeURIComponent(u.deliveryId)}/qr.svg" alt="${esc(t().qrAlt(u.deliveryId))}" width="240" height="240"></div>
        <div class="row"><button class="btn ghost" id="copiar">${esc(t().copiar)}</button>
          <a class="btn primary" href="${esc(wa)}" target="_blank" rel="noopener">${esc(t().compartir)}</a></div>
        ${u.exclusaoPendente ? `<p><span class="pill warn">${esc(t().exclusionPendiente)}</span></p>` : ''}
      </div>
      <h2>${esc(t().zona)}: ${esc(u.zona)}</h2>
      <div class="map small" id="map" aria-hidden="true"></div>
      <dl class="info card">
        <dt>${esc(t().confianza)}</dt><dd>${esc(t().entregas(u.entregasConfirmadas))}</dd>
        <dt>${esc(t().visible)}</dt><dd>${esc(nivelNome(u.nivelConsentimento))}</dd>
        <dt>${esc(t().creadoEn)}</dt><dd>${esc(data)}</dd>
        ${u.unidade ? `<dt>${esc(t().unidad)}</dt><dd>${esc(u.unidade)}</dd>` : ''}
      </dl>
      <section aria-labelledby="h-tienda">
        <h2 id="h-tienda">${esc(t().tiendaTitulo)}</h2>
        <p class="muted">${esc(t().tiendaLead)}</p>
        ${state.yo.rucVinculado && state.yo.rucUidPrincipal === u.deliveryId ? `<p><span class="pill ok">${esc(t().rucJunto(state.yo.ruc))}</span></p>` : ''}
        <div id="compartidos"></div>
        ${u.exclusaoPendente ? `<p class="muted">${esc(t().tiendaBloqueada)}</p>` : `
        <form class="card stack" id="ft" novalidate>
          <label class="f">${esc(t().tiendaBuscar)}<input type="search" id="tienda-busca" autocomplete="off" placeholder="${esc(t().tiendaBuscar)}"></label>
          <div class="lojas" id="lojas" role="radiogroup" aria-label="${esc(t().tiendaBuscar)}"></div>
          <label class="f">${esc(t().tiendaRef)} <small>${esc(t().opcional)}</small>
            <input type="text" id="tienda-ref" maxlength="80" aria-describedby="h-tref"><small id="h-tref">${esc(t().tiendaRefAyuda)}</small></label>
          <p class="error" id="errt" role="alert"></p>
          <button class="btn primary" type="submit">${esc(t().tiendaEnviar)}</button>
        </form>`}
      </section>
      <h2>${esc(t().editar)}</h2>
      <form class="card stack" id="fe" novalidate>
        <label class="f">${esc(t().apodo)}<input type="text" name="apelido" maxlength="40" required value="${esc(u.apelido)}"></label>
        <label class="f">${esc(t().referencias)}<textarea name="referencias" maxlength="500" required>${esc(u.referenciasAcesso)}</textarea></label>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary" type="submit">${esc(t().guardar)}</button>
      </form>
      ${maiores.length ? `<h2>${esc(t().ampliar)}</h2><p class="muted">${esc(t().ampliarLead)}</p>
        <div class="stack">${maiores.map((k) => `<button class="btn ghost" data-nivel="${k}">${esc(t().ampliarA(nivelNome(k)))}</button>`).join('')}</div>` : ''}
      ${u.exclusaoPendente ? '' : `<h2></h2><button class="btn danger" id="eliminar">${esc(t().eliminar)}</button>`}
      <p><a class="btn ghost" href="#/inicio">${esc(t().volver)}</a></p>`, '#code');

    const map = baseMap('map', { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false, keyboard: false })
      .setView([u.lat, u.lng], 17);
    L.marker([u.lat, u.lng], { icon: pinIcon(), interactive: false }).addTo(map);

    document.getElementById('copiar').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(u.deliveryId); toast(t().copiado); }
      catch (e) { const r = document.createRange(); r.selectNodeContents(document.getElementById('code')); getSelection().removeAllRanges(); getSelection().addRange(r); }
    });
    const fe = document.getElementById('fe');
    fe.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = fe.querySelector('button');
      busy(btn, true);
      try {
        await api('PATCH', '/uids/' + encodeURIComponent(u.deliveryId), { apelido: fe.apelido.value.trim(), referenciasAcesso: fe.referencias.value.trim() });
        toast(t().guardado);
      } catch (err) { document.getElementById('err').textContent = err.message; }
      finally { busy(btn, false); }
    });
    main.querySelectorAll('[data-nivel]').forEach((b) => b.addEventListener('click', async () => {
      if (!(await confirmar(t().confirmarAmpliar(nivelNome(b.dataset.nivel))))) return;
      try { await api('POST', `/uids/${encodeURIComponent(u.deliveryId)}/consentimiento`, { nivelConsentimento: b.dataset.nivel }); toast(t().guardado); telaUid(u.deliveryId); }
      catch (err) { toast(err.message); }
    }));
    montarTiendas(u);
    const el = document.getElementById('eliminar');
    if (el) el.addEventListener('click', async () => {
      if (!(await confirmar(t().confirmarEliminar))) return;
      try { await api('POST', `/uids/${encodeURIComponent(u.deliveryId)}/eliminacion`, {}); toast(t().eliminacionPedida); telaUid(u.deliveryId); }
      catch (err) { toast(err.message); }
    });
  }

  async function montarTiendas(u) {
    const id = encodeURIComponent(u.deliveryId);
    const caixa = document.getElementById('compartidos');
    async function listarCompartidos() {
      let lista = [];
      try { lista = await api('GET', `/uids/${id}/lojas`); } catch (e) { return; }
      caixa.innerHTML = lista.length ? `<ul class="compartidos card">${lista.map((c) => `
        <li><div><b>${esc(c.lojaNome)}</b><span class="muted">${c.origem === 'RUC' ? esc(t().viaRuc) : esc(c.lojaCidade) + (c.referenciaCliente ? ' · ' + esc(c.referenciaCliente) : '')}</span></div>
        <button type="button" class="link" data-quitar="${esc(c.lojaId)}" data-nome="${esc(c.lojaNome)}">${esc(t().tiendaQuitar)}</button></li>`).join('')}</ul>` : '';
      if (lista.length) caixa.querySelector('ul').insertAdjacentHTML('afterbegin', `<li class="cab"><span class="muted">${esc(t().tiendaCompartido)}</span></li>`);
      caixa.querySelectorAll('[data-quitar]').forEach((b) => b.addEventListener('click', async () => {
        if (!(await confirmar(t().tiendaConfirmarQuitar(b.dataset.nome)))) return;
        try { await api('DELETE', `/uids/${id}/lojas/${encodeURIComponent(b.dataset.quitar)}`); toast(t().tiendaQuitado); listarCompartidos(); }
        catch (err) { toast(err.message); }
      }));
    }
    listarCompartidos();

    const ft = document.getElementById('ft');
    if (!ft) return;
    let lojas = [];
    try { lojas = await api('GET', '/lojas'); } catch (e) { /* lista vazia */ }
    const lista = document.getElementById('lojas');
    const busca = document.getElementById('tienda-busca');
    const sem = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    function desenhar() {
      const q = sem(busca.value.trim());
      const marcada = (lista.querySelector('input:checked') || {}).value;
      const achadas = lojas.filter((l) => !q || sem(l.nome + ' ' + l.cidade).includes(q));
      lista.innerHTML = achadas.length ? achadas.map((l) => `
        <label class="loja"><input type="radio" name="loja" value="${esc(l.id)}" ${l.id === marcada ? 'checked' : ''}>
          <span class="loja-ini" aria-hidden="true">${esc(l.nome.slice(0, 1).toUpperCase())}</span>
          <span><b>${esc(l.nome)}</b><small>${esc(l.cidade)}</small></span></label>`).join('')
        : `<p class="muted">${esc(t().tiendaNinguna)}</p>`;
    }
    busca.addEventListener('input', desenhar);
    desenhar();
    ft.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById('errt');
      const marcada = lista.querySelector('input:checked');
      if (!marcada) { err.textContent = t().tiendaElegi; return; }
      const btn = ft.querySelector('button[type=submit]');
      busy(btn, true); err.textContent = '';
      try {
        const c = await api('POST', `/uids/${id}/lojas`, { lojaId: marcada.value, referenciaCliente: document.getElementById('tienda-ref').value.trim() });
        toast(t().tiendaEnviado(c.lojaNome));
        document.getElementById('tienda-ref').value = '';
        marcada.checked = false;
        listarCompartidos();
      } catch (e2) { err.textContent = e2.message; }
      finally { busy(btn, false); }
    });
  }

  async function montarRuc() {
    const fr = document.getElementById('fr');
    const sel = document.getElementById('ruc-uid');
    const vinc = document.getElementById('ruc-vinc');
    const wrap = document.getElementById('ruc-uid-wrap');
    const ajustar = () => { wrap.hidden = !vinc.checked; };
    vinc.addEventListener('change', ajustar);
    ajustar();
    fr.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById('errr');
      const btn = fr.querySelector('button[type=submit]');
      busy(btn, true); err.textContent = '';
      try {
        state.yo = await api('PUT', '/yo/ruc', { ruc: document.getElementById('ruc').value.trim(), vinculado: vinc.checked, uidPrincipal: vinc.checked ? sel.value || null : null });
        toast(t().guardado); telaCuenta();
      } catch (e2) { err.textContent = e2.message; }
      finally { busy(btn, false); }
    });
    const borrar = document.getElementById('ruc-borrar');
    if (borrar) borrar.addEventListener('click', async () => {
      try { state.yo = await api('PUT', '/yo/ruc', { ruc: null }); toast(t().rucBorrado); telaCuenta(); }
      catch (e2) { document.getElementById('errr').textContent = e2.message; }
    });
    // A lista de UIDs chega depois; os botões já funcionam antes dela.
    let uids = [];
    try { uids = (await api('GET', '/uids')).filter((x) => !x.exclusaoPendente); } catch (e) { /* sem lista */ }
    sel.innerHTML = uids.length ? uids.map((x) => `<option value="${esc(x.deliveryId)}" ${x.deliveryId === state.yo.rucUidPrincipal ? 'selected' : ''}>${esc(x.apelido)} · ${esc(x.deliveryId)}</option>`).join('')
      : `<option value="">${esc(t().rucSinUid)}</option>`;
  }

  function telaCuenta() {
    view(`
      <h1>${esc(t().cuentaTitulo)}</h1>
      <dl class="info card"><dt>${esc(t().celularCuenta)}</dt><dd class="mono">${esc(state.yo.telefone)}</dd></dl>
      <form class="card stack" id="f" novalidate>
        <label class="f">${esc(t().nombre)} <small>${esc(t().opcional)}</small>
          <input type="text" name="nome" maxlength="80" value="${esc(state.yo.nome || '')}"></label>
        <p class="error" id="err" role="alert"></p>
        <button class="btn primary" type="submit">${esc(t().guardar)}</button>
      </form>
      <section aria-labelledby="h-ruc">
        <h2 id="h-ruc">${esc(t().rucTitulo)}</h2>
        <p class="muted">${esc(t().rucLead)}</p>
        <form class="card stack" id="fr" novalidate>
          ${state.yo.ruc ? `<p><span class="pill ${state.yo.rucVinculado ? 'ok' : ''}">${esc(t().rucEstado(state.yo.rucVinculado))}</span></p>` : ''}
          <label class="f">${esc(t().rucCampo)}
            <input type="text" id="ruc" inputmode="numeric" autocomplete="off" maxlength="20" placeholder="1234567-9" value="${esc(state.yo.ruc || '')}" aria-describedby="h-rucx">
            <small id="h-rucx">${esc(t().rucAyuda)}</small></label>
          <label class="check"><input type="checkbox" id="ruc-vinc" ${state.yo.rucVinculado ? 'checked' : ''}> <span>${esc(t().rucVincular)}</span></label>
          <label class="f" id="ruc-uid-wrap">${esc(t().rucUid)}<select id="ruc-uid"></select></label>
          <p class="error" id="errr" role="alert"></p>
          <div class="row"><button class="btn primary" type="submit">${esc(t().rucGuardar)}</button>
          ${state.yo.ruc ? `<button class="btn ghost" type="button" id="ruc-borrar">${esc(t().rucBorrar)}</button>` : ''}</div>
        </form>
      </section>
      <div class="stack">
        <h2></h2>
        <button class="btn ghost" id="sair">${esc(t().salir)}</button>
        <button class="btn danger" id="borrar">${esc(t().borrarCuenta)}</button>
        <a class="btn ghost" href="#/inicio">${esc(t().volver)}</a>
      </div>${foot()}`, 'h1');
    const f = document.getElementById('f');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      try { state.yo = await api('PATCH', '/yo', { nome: f.nome.value.trim() || null }); toast(t().guardado); }
      catch (err) { document.getElementById('err').textContent = err.message; }
    });
    montarRuc();
    document.getElementById('sair').addEventListener('click', async () => {
      try { await api('DELETE', '/sesion'); } catch (e) { /* sessão já vencida */ }
      state.yo = null; go('/entrar');
    });
    document.getElementById('borrar').addEventListener('click', async () => {
      if (!(await confirmar(t().confirmarBorrar))) return;
      try { await api('DELETE', '/yo'); state.yo = null; toast(t().cuentaBorrada); go('/entrar'); }
      catch (err) { toast(err.message); }
    });
  }

  /* ---------------- roteador ---------------- */

  async function render() {
    const rota = (location.hash || '#/inicio').slice(1);
    const publica = rota === '/entrar' || rota === '/codigo';
    if (!state.yo && !publica) {
      try { state.yo = await api('GET', '/yo'); }
      catch (e) { if (e.status !== 401) toast(e.message); return go('/entrar'); }
      if (state.yo.idioma !== state.lang) { state.lang = state.yo.idioma; setLang(state.lang); return; }
    }
    if (state.yo && publica) return go('/inicio');
    if (state.yo && !state.yo.termosAceitos && rota !== '/bienvenida' && rota !== '/cuenta') return go('/bienvenida');
    if (rota === '/entrar') return telaEntrar();
    if (rota === '/codigo') return telaCodigo();
    if (rota === '/bienvenida') return telaBienvenida();
    if (rota === '/nuevo') return telaNuevo();
    if (rota === '/cuenta') return telaCuenta();
    if (rota.startsWith('/uid/')) return telaUid(decodeURIComponent(rota.slice(5)));
    return telaInicio();
  }

  window.addEventListener('hashchange', render);
  document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'es-PY';
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* funciona sem modo offline */ });
  }
})();
