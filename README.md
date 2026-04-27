# faturaodonto

Site estático do curso **FaturaOdonto** — faturamento de convênios odontológicos: landing, módulos, aulas em HTML, materiais bônus e página de anúncios (**HTML, CSS e JavaScript**).

## Colocar o site no ar (sem GitHub Pages)

O GitHub Pages às vezes falha por configuração da conta. Estas opções costumam ser **mais simples** e funcionam com o mesmo projeto (só HTML/CSS/JS).

### Opção 1 — Netlify Drop (a mais fácil, só navegador)

1. No PC, deixe a pasta do projeto pronta: `curso-faturamento-convenios` (com `index.html`, `styles.css`, `marisa.jpg`, pasta `aulas`, etc.).
2. Abra **https://app.netlify.com/drop**
3. **Arraste a pasta inteira** para a página.
4. Em segundos o Netlify mostra um link tipo `https://nome-aleatorio.netlify.app` — esse é o endereço para compartilhar.
5. (Opcional) Crie login no Netlify para **fixar o nome** do site e não perder o link.

Não precisa de linha de comando nem de GitHub Pages.

### Opção 2 — Netlify ligado ao GitHub

1. Acesse **https://app.netlify.com** → **Add new site** → **Import an existing project**
2. Conecte o GitHub e escolha o repositório **faturaodonto**
3. Deixe **Build command** vazio e **Publish directory** como **`.`** (ponto = raiz), ou confira se o arquivo **`netlify.toml`** do repo foi detectado
4. **Deploy site** — cada `git push` na `main` atualiza o site

### Opção 3 — Vercel

1. **https://vercel.com** → **Add New** → **Project** → importe o repo **faturaodonto**
2. Framework: **Other**; **Root Directory** `./`; sem comando de build
3. **Deploy**

### Depois de publicar

Atualize no código as meta tags **`og:url`** e **`og:image`** em `index.html` e `anuncio.html` para a **URL real** do Netlify/Vercel (assim WhatsApp e redes mostram a prévia certa).

### GitHub Pages (se quiser insistir)

1. Repo → **Settings** → **Pages**
2. **Source:** **Deploy from a branch** → **main** → **`/ (root)`**
3. Site: `https://marisacastro03.github.io/faturaodonto/`

O arquivo **`.nojekyll`** ajuda o GitHub a não processar o site com Jekyll.

### Domínio próprio

Configure no painel do Netlify/Vercel/GitHub (**Custom domain**) e depois ajuste as meta tags `og:*` para essa URL.
