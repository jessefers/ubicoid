---
name: ecosys-checklist-entrega
description: Use antes de publicar qualquer alteracao no UbicoID (pagina, video, PDF, imagem ou texto). Confere paridade PT/ES, cifragem, contraste e registro da versao.
---

# Checklist de entrega ECOSYS (UbicoID)

Execute os passos em ordem e relate o resultado de cada um em uma tabela (item, status, evidencia).

1. **Paridade PT/ES.** Todo arquivo `*-pt.*` tem o par `*-es.*` (e o inverso), na raiz e em `data/`. Liste os pares faltantes. Exceção: logos em `sac/` e `portal/sac/` usam o nome sem sufixo para o português (ex.: `UbicoID-SAC-logo-sau.svg` ↔ `UbicoID-SAC-logo-sau-es.svg`).
2. **Cifragem.** Em `data/` so existem `.bin` e `meta.json`. Nenhum PDF, MP4 ou HTML de conteudo restrito em claro no repositorio.
3. **Segredos.** Nenhuma senha, chave, token ou `.env` em arquivos alterados (o hook `guarda-segredos` bloqueia; aqui e a conferencia humana).
4. **Contraste.** Nas paginas alteradas, nenhum texto ou botao escuro sobre fundo escuro, nem claro sobre claro; conferir modo claro e escuro.
5. **Branding.** Usar apenas a identidade do UbicoID (logos em `portal/sac/`, fontes Geist). Nao trazer identidade de outro projeto.
6. **Registro.** Atualizar a data de base no `README.md` se o conteudo mudou e escrever mensagem de commit em portugues, descrevendo o que mudou para o revisor.

So declare "pronto para publicar" se todos os itens estiverem conformes; caso contrario, liste o que falta.
