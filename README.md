# faturaodonto

Site estático do curso **FaturaOdonto** — faturamento de convênios odontológicos: landing, módulos, aulas em HTML, materiais bônus e página de anúncios (**HTML, CSS e JavaScript**).

## Site no ar (link para compartilhar)

**https://marisacastro03.github.io/faturaodonto/**

- Home: abre o `index.html` automaticamente
- Landing de anúncios: [anuncio.html](https://marisacastro03.github.io/faturaodonto/anuncio.html)

### Publicar no GitHub Pages (recomendado: pela branch — sem Actions)

Este repositório é só HTML/CSS/JS. A forma mais simples é **publicar direto da branch `main`**, sem workflow:

1. Abra **https://github.com/marisacastro03/faturaodonto**
2. **Settings** → **Pages**
3. Em **Build and deployment** → **Source**, escolha **Deploy from a branch**
4. **Branch:** `main` → pasta **`/ (root)`** → **Save**
5. Em 1–2 minutos o site aparece no link acima (atualize a página se precisar)

O arquivo **`.nojekyll`** na raiz evita que o GitHub tente processar o site com Jekyll e quebre os links.

### Domínio próprio (opcional)

Em **Settings** → **Pages** → **Custom domain**. Depois atualize `og:url` e `og:image` em `index.html` e `anuncio.html` para a nova URL.
