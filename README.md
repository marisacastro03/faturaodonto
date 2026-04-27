# faturaodonto

Site estático do curso **FaturaOdonto** — faturamento de convênios odontológicos: landing, módulos, aulas em HTML, materiais bônus e página de anúncios (**HTML, CSS e JavaScript**).

## Site público (sempre a partir deste repositório)

URL do site:

**https://marisacastro03.github.io/faturaodonto/**

- Home: `index.html`
- Landing de anúncios: `anuncio.html`

### Como funciona

1. Você trabalha na branch **`main`** (código-fonte do site).
2. O workflow **Deploy GitHub Pages** (em `.github/workflows/deploy-pages.yml`) copia os arquivos para a branch **`gh-pages`**.
3. O **GitHub Pages** serve o site a partir da branch **`gh-pages`**.

### Configurar o GitHub Pages (uma vez)

1. Abra o repositório no GitHub → **Settings** → **Pages**
2. **Build and deployment** → **Source:** **Deploy from a branch**
3. **Branch:** selecione **`gh-pages`** e pasta **`/ (root)`** → **Save**
4. Faça um **push** na `main` (ou em **Actions** rode o workflow **Deploy GitHub Pages** manualmente). Na primeira vez, o workflow **cria** a branch `gh-pages`
5. Em até alguns minutos o link **https://marisacastro03.github.io/faturaodonto/** deve abrir

### Se o workflow falhar

1. **Settings** → **Actions** → **General** → **Workflow permissions** → marque **Read and write permissions** e **Allow GitHub Actions to create and approve pull requests** (se aparecer) → **Save**
2. Na aba **Actions**, abra o workflow vermelho → clique no job **deploy** → leia o log do passo que falhou (copie a última mensagem de erro)
3. Confirme em **Settings** → **Pages** que a branch é **`gh-pages`** e a pasta **`/`** (não use **main** aqui depois de adotar este fluxo)

### Meta tags (Open Graph)

Em `index.html` e `anuncio.html`, `og:url` e `og:image` já apontam para `https://marisacastro03.github.io/faturaodonto/`. Se usar domínio próprio depois, atualize essas URLs.

O arquivo **`.nojekyll`** evita que o Jekyll altere o site estático.
