# faturaodonto

Site estático do curso **FaturaOdonto** — faturamento de convênios odontológicos: landing, módulos, aulas em HTML, materiais bônus e página de anúncios (**HTML, CSS e JavaScript**).

## Link do site (GitHub Pages)

**https://marisacastro03.github.io/faturaodonto/**

(é preciso o **`/faturaodonto/`** no final — é site de **projeto**, não de usuário.)

---

### Se aparecer **404 — There isn't a GitHub Pages site here**

Faça nesta ordem:

#### 1. Repositório **público**

No plano **gratuito**, o GitHub Pages para este tipo de site costuma exigir repositório **público**.

- **Settings** → role até **Danger Zone** → **Change repository visibility** → **Public** (se ainda estiver privado).

#### 2. Ativar Pages na branch **main**

1. **Settings** → **Pages**
2. **Build and deployment** → **Source:** **Deploy from a branch** (não “GitHub Actions”)
3. **Branch:** escolha **`main`** → pasta **`/ (root)`** → **Save**
4. Espere **2 a 10 minutos** e teste de novo o link (às vezes demora).

#### 3. Conferir o endereço

Abra exatamente:

`https://marisacastro03.github.io/faturaodonto/`

Não use só `https://marisacastro03.github.io` (isso é outro tipo de site).

---

### Sobre este repositório

- O site está na **raiz** da branch **`main`** (`index.html`, `styles.css`, pasta `aulas`, etc.).
- O arquivo **`.nojekyll`** evita que o GitHub rode Jekyll e quebre páginas estáticas.
- **Não é necessário** workflow de Actions nem branch `gh-pages` para esse modo.

### Open Graph

Em `index.html` e `anuncio.html`, as meta tags `og:url` e `og:image` usam `https://marisacastro03.github.io/faturaodonto/`. Com domínio próprio, atualize para a URL final.
