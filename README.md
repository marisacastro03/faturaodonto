# faturaodonto

Site estático do curso **FaturaOdonto** — faturamento de convênios odontológicos: landing, módulos, aulas em HTML, materiais bônus e página de anúncios (**HTML, CSS e JavaScript**).

## Site no ar (link para compartilhar)

Depois de ativar o GitHub Pages (passos abaixo), o endereço público será:

**https://marisacastro03.github.io/faturaodonto/**

- Página inicial: `index.html` (abre automaticamente)
- Landing de anúncios: `anuncio.html`

### Ativar o GitHub Pages (uma vez)

1. Abra o repositório no GitHub: **marisacastro03/faturaodonto**
2. Vá em **Settings** → **Pages** (menu lateral)
3. Em **Build and deployment** → **Source**, escolha **GitHub Actions** (não “Deploy from a branch” se quiser usar o workflow já configurado neste repo)
4. Faça um **push** na branch `main` (ou use **Actions** → workflow **Deploy GitHub Pages** → **Run workflow**). Quando o job ficar verde, o site estará publicado em alguns minutos
5. Se a primeira publicação não aparecer, confira **Settings** → **Pages** se a **URL** do site está indicada e se não há erros na aba **Actions**

### Domínio próprio (opcional)

Quando comprar domínio (ex.: `faturaodonto.com.br`), configure no GitHub em **Pages** → **Custom domain** e atualize no código as meta tags `og:url` e `og:image` em `index.html` e `anuncio.html` para usar a nova URL.
