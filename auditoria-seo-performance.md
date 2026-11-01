# Auditoria SEO, performance e metatags — SP Motos

Data: 31/10/2026 · Base: commit `044f495` · Next.js 16.3.5

Método: leitura de todos os arquivos de `app/`, `components/` e `lib/`; build de produção; Lighthouse mobile; teste de navegação com Chrome (390px e 1366px); conferência na documentação do Next 16 (`node_modules/next/dist/docs`).

## Placar atual (Lighthouse mobile, build local)

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP |
|---|---|---|---|---|---|
| Home `/` | 94 | 100 | 100 | 100 | 3,0 s |
| Detalhe `/motos/[id]` | 99 | 100 | 100 | 100 | 1,9 s |

O SEO 100 do Lighthouse só confere o básico (title, description, viewport, lang). Ele **não** mede sitemap, dados estruturados, canonical, palavras-chave nem se o Google encontra as motos. É aí que estão as lacunas.

---

## Checklist

Legenda: ✅ ok · ⚠️ parcial · ❌ falta

### Técnico / infraestrutura
- ✅ HTTPS: automático na Vercel com domínio próprio
- ✅ Responsivo: sem rolagem lateral em 390px e 1366px; menu mobile funciona
- ✅ `lang="pt-BR"`, viewport correto, link "pular para o conteúdo"
- ✅ Fontes via `next/font` (Geist)
- ✅ Imagens via `next/image`, com `remotePatterns` restritos
- ❌ Sem tratamento de erro: se o feed cair, o site inteiro dá 500 (sem `error.tsx`)
- ❌ Página 404 em inglês ("This page could not be found")
- ❌ Sem cabeçalhos de segurança (`X-Content-Type-Options`, `Referrer-Policy` etc.)
- ❌ Sem métricas (Analytics / Speed Insights / Search Console)

### Metatags
- ⚠️ `title` da home sai **"Início"**, sem marca nem cidade
- ⚠️ `description` genérica, sem "Pelotas" e sem "motos seminovas"
- ❌ Sem `canonical` em nenhuma página
- ⚠️ Open Graph: a imagem é o logo quadrado em `.webp`. A prévia no WhatsApp fica ruim
- ❌ Página de moto sem `og:image` com a foto da moto (prévia ao compartilhar no WhatsApp)
- ❌ `SITE_URL` cai em `http://localhost:3000` se não estiver definida (OG e links do WhatsApp quebram)
- ⚠️ Ícones: favicon de 32px usado também como `apple-touch-icon`

### Indexação
- ❌ Sem `sitemap.xml`
- ❌ Sem `robots.txt`
- ❌ Os cards linkam para `/?moto=ID` (modal), não para `/motos/ID`. O Google não encontra as páginas das motos
- ❌ Sem dados estruturados (JSON-LD) de loja nem de veículo
- ⚠️ URLs com filtro (`/?busca=...&marca=...`) geram conteúdo duplicado sem canonical

### Conteúdo / palavras-chave
- ⚠️ H1 da home "Há 28 anos realizando sonhos." não tem nenhuma palavra buscada
- ⚠️ H2 "Estoque" genérico
- ⚠️ Rodapé sem horário e sem links internos (o NAP fica incompleto)

### Performance
- ⚠️ LCP da home 3,0 s no limite (meta: < 2,5 s)
- ❌ A galeria baixa **todas** as fotos de uma vez (média de 14, máximo de 21 por moto)
- ⚠️ `priority` está obsoleto no Next 16 e está em 4 lugares concorrendo pelo LCP
- ⚠️ Barra de contato no mobile ocupa cerca de 150px acima do hero
- ⚠️ `banner.webp` com 339 KB (maior que o `.jpeg` original)
- ⚠️ Pôster do vídeo de consignação é o próprio logo (arquivo idêntico)
- ⚠️ Sem AVIF nas imagens otimizadas

---

## Análise detalhada por arquivo

### P0: bloqueia lançamento

**1. `lib/env.ts:7`: `SITE_URL` cai em localhost**
```ts
process.env.SITE_URL ?? "http://localhost:3000"
```
Se a variável faltar na Vercel, `og:image`, `metadataBase` e o **link da moto enviado no WhatsApp** (`lib/whatsapp.ts:7`) apontam para `localhost`. O cliente recebe um link quebrado.
- Correção: usar `VERCEL_PROJECT_PRODUCTION_URL` como fallback e lançar erro em produção se nenhum estiver definido.

**2. `components/MotoGrid.tsx:13` e `lib/estoque-query.ts:80`: motos não são rastreáveis**
`buildHomeMotoModalHref` gera `/?moto=ID`. A página `/motos/[id]` existe, mas nada no site aponta para ela.
- Correção (padrão oficial do Next): **rotas interceptadas**. Criar `app/@modal/(.)motos/[id]/page.tsx`. O card passa a apontar para `/motos/ID`. Na navegação interna abre o modal (mesma UX de hoje), e em acesso direto ou para o Google abre a página completa.
- Isso substitui `MotoDetailModal`, `parseMotoDetailId` e `buildHomeHrefWithoutMoto` (o fechamento vira `router.back()`).

**3. Sem `app/sitemap.ts` e `app/robots.ts`**
- `sitemap.ts`: `/`, `/contato`, `/venda-sua-moto` + todas as `/motos/[id]` do feed, com `lastModified = atualizado_em`.
- `robots.ts`: libera tudo e aponta o sitemap.

**4. `app/page.tsx:28-31`: título "Início"**
A documentação do Next 16 confirma: `title.template` do layout **não vale** para o `page.tsx` do mesmo segmento.
- Correção: `title: { absolute: "SP Motos | Loja de Motos Seminovas em Pelotas/RS" }`.

**5. Sem `app/error.tsx` e `app/not-found.tsx`**
O erro 500 de hoje derrubou a home inteira. Mesmo com a correção do commit `044f495`, se o Click Garage ficar fora do ar o site cai.
- `app/page.tsx:45`: envolver a busca do feed em try/catch e mostrar `EmptyState` com WhatsApp.
- `app/error.tsx`: fallback em pt-BR com botão de WhatsApp.
- `app/not-found.tsx`: 404 em pt-BR com link para o estoque.

### P1: SEO

**6. `app/layout.tsx`: JSON-LD da loja**
Adicionar `<script type="application/ld+json">` com `@type: "MotorcycleDealer"`: nome, endereço (`copy.contato.address`), `geo` (`lib/store-location.ts:2-3`), telefones (`lib/store-whatsapp.ts`), `openingHoursSpecification` (seg–sex 9–18, sáb 9–12), `sameAs` (`lib/social.ts`), `hasMap` (`STORE_GOOGLE_MAPS_URL`). Escapar `<` como `\u003c`, como manda a documentação do Next.

**7. `app/motos/[id]/page.tsx`: JSON-LD de veículo**
`@type: ["Product", "Motorcycle"]` com `brand`, `vehicleModelDate`, `mileageFromOdometer` (km), `color`, `fuelType`, `image` (galeria) e `offers` (`price`, `priceCurrency: BRL`, `availability: InStock`, `seller` → a loja).

**8. `app/motos/[id]/page.tsx:16-28`: metadata da moto**
- `description` hoje: "TÍTULO — R$ X". Melhor: "Honda Sahara 300 2024, 12.000 km, cor vermelha, R$ 31.900. Moto seminova à venda na SP Motos em Pelotas/RS. Negocie pelo WhatsApp."
- `openGraph.images`: `moto.imagemPrincipal`. É o que aparece quando a loja manda o link no WhatsApp.
- `alternates.canonical: /motos/${id}`.
- Moto inexistente: hoje retorna `title` sem `robots: { index: false }`.

**9. Canonical em todas as páginas**
- `app/layout.tsx`: definir `alternates.canonical: "./"` relativo, ou por página.
- Home com filtros: canonical `/`.

**10. Open Graph padrão: `lib/site-metadata.ts:5`**
`OG_IMAGE_PATH = "/logo-spmotos.webp"` (1024×1024). Trocar por `app/opengraph-image.jpg` em 1200×630, com fachada e logo. O Next gera as tags sozinho pela convenção de arquivo.

**11. Palavras-chave: `lib/copy.ts`**
- `tagline` (linha 3) também é a description padrão. Sugestão: "Motos seminovas em Pelotas/RS com financiamento, consórcio e negociação pelo WhatsApp."
- `home.heroKicker` (linha 63): "Loja de motos em Pelotas/RS". O H1 continua emocional, e a cidade aparece logo acima.
- `home.estoqueTitle` (linha 74): "Motos seminovas à venda".
- `contato.title` (linha 145): "Contato e endereço — loja de motos em Pelotas".
- Remover chaves não usadas: `card.installment*`, `card.location`, `trust.item1/2*`, `filters.anoMin/anoMax/kmMax/aplicar/marca/valorMax`, `whatsapp`, `whatsappVenda`, `kmLabel`, `home.title`.

**12. `components/SiteFooter.tsx`: NAP completo**
Adicionar horário (`copy.contato.hours`), links internos (Estoque, Venda sua moto, Contato) e os telefones em texto. É um sinal de SEO local.

**13. Ícones: `app/layout.tsx:32-35`**
Trocar por `app/icon.png` (512) e `app/apple-icon.png` (180), seguindo a convenção de arquivos do Next. Hoje o `apple` usa o favicon de 32px.

### P1: Performance

**14. `components/MotoGallery.tsx:122-140`: todas as fotos carregadas de uma vez**
```tsx
{uniquePhotos.map(... <Image ... loading={index === 0 ? undefined : "eager"} />)}
```
Uma moto com 21 fotos baixa 21 imagens de cerca de 828px ao abrir o modal. São vários MB no 4G.
- Correção: renderizar só a foto atual. Os vizinhos já são pré-carregados por `preloadGalleryPhoto` (linhas 95-109), então o efeito de fade continua funcionando sem a pilha.

**15. `priority` obsoleto (Next 16 → `preload`) e concorrendo pelo LCP**
- `HomeHero.tsx:25` → `preload` (é o LCP da home, correto).
- `HeaderNav.tsx:80` (logo) → remover. O logo não é o LCP e rouba banda do banner.
- `MotoCard.tsx:58` / `MotoGrid.tsx:19` (1º card) → remover. No mobile fica abaixo da dobra.
- `MotoGallery.tsx:137` → `preload` só na página `/motos/[id]`.

**16. `components/HeaderContactBar.tsx:36-53`: barra de contato no mobile**
Três linhas com `min-h-[44px]` (endereço, horário, WhatsApp) somam cerca de 150px antes do logo (visível no screenshot do teste). Isso empurra o hero e o H1 para baixo.
- Correção: no mobile, uma linha só (ícone de pin + WhatsApp). O horário já aparece no hero (`HomeHero.tsx:41`).

**17. `next.config.ts`: imagens**
- `images.formats: ["image/avif", "image/webp"]`: cerca de 20–30% menor.
- `images.minimumCacheTTL: 2592000` (30 dias): as fotos do Click Garage não mudam de URL.

**18. Assets em `public/`**
- `banner.webp` 339 KB / 1600×1200: recodificar com qualidade de cerca de 70 (`scripts/build-banner-webp.mjs`) para ficar abaixo de 150 KB.
- `consignacao-poster.webp` é **idêntico** ao `logo-spmotos.webp`. Gerar um frame real do vídeo em 9:16.
- `consignacao.mp4` com 8 MB está ok (`preload="none"`).

**19. `app/page.tsx:26`: `revalidate = 300` sem efeito**
A home lê `searchParams`, então é dinâmica (ƒ no build). O cache real vem do `fetch` com `next.revalidate` (`client.ts:18`), que funciona. Remover o export para não enganar quem ler o código.

### P2: Qualidade, acessibilidade e segurança

**20. `components/WhatsAppContactButtons.tsx:85`: `aria-label` diferente do texto visível**
Lighthouse aponta `label-content-name-mismatch`: o visível é "Negociar com Sandra (53)…" e o leitor de tela ouve "Negociar no WhatsApp com Sandra…". Quem usa comando de voz não consegue acionar.
- Correção: remover o `aria-label`, porque o texto visível já tem nome e telefone. Ou fazer o label começar pelo texto visível.

**21. `components/MotoCard.tsx:52, 72, 95`: três links iguais por card**
São 36 paradas de Tab para 12 motos. Usar um link só (título) com área clicável esticada (`after:absolute after:inset-0`).

**22. `app/actions/estoque-batch.ts:34`: parâmetros sem validação**
`input.params` vem do cliente sem validação. Server Actions são endpoints públicos. Validar com Zod (strings com limite de tamanho, números finitos, `ordenar` no enum).

**23. `next.config.ts`: cabeçalhos de segurança**
`headers()` com `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` e `Permissions-Policy: geolocation=(self)` (o `ContatoDirections` usa geolocalização).

**24. Medição**
Ativar Vercel Web Analytics + Speed Insights (painel da Vercel, cerca de 2 linhas no layout) e cadastrar o Google Search Console.

---

## Plano de ação

| Fase | Itens | Tempo estimado | Resultado visível |
|---|---|---|---|
| **1. Indexação (P0)** | 1, 2, 3, 4, 5 | 3–4 h | Google encontra todas as motos; título certo; site não cai se o feed falhar |
| **2. SEO local** | 6, 7, 8, 9, 10, 11, 12, 13 | 3–4 h | Rich results de loja e veículo; prévia com foto no WhatsApp |
| **3. Performance** | 14–19 | 2–3 h | LCP da home < 2,5 s; modal da moto baixa 1 foto em vez de 14 |
| **4. Qualidade** | 20–24 | 1–2 h | Acessibilidade sem alertas; server action blindada; métricas ativas |

Ordem recomendada: 1 → 2 → 3 → 4. A fase 1 é pré-requisito para as outras renderem resultado no Google.

### Fora do código (cliente / dono da loja)
1. Perfil da Empresa no Google: categoria "Concessionária de motocicletas", fotos e pedido de avaliações
2. Domínio: confirmar se `spmotos.com.br` (titular Roger de Moura) é da loja
3. Definir `SITE_URL` na Vercel com o domínio final
4. Google Search Console: verificar o domínio e enviar `/sitemap.xml`
5. Mesmo nome, endereço e telefone em Google, Instagram, Facebook e site

### Validação ao fim de cada fase
- `npm run build` + `npm run lint`
- Lighthouse mobile em `/` e `/motos/[id]`
- Teste de navegação (Playwright): cards, modal, WhatsApp, 404
- [Rich Results Test](https://search.google.com/test/rich-results) para o JSON-LD
- Conferir `/sitemap.xml` e `/robots.txt`
