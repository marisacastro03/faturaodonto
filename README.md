# faturaodonto

Site estático do curso **FaturaOdonto** — faturamento de convênios odontológicos.

## Link para testar

**https://marisacastro03.github.io/faturaodonto/**

(use exatamente com **`/faturaodonto/`** no final)

---

## Se aparece **404 — There isn't a GitHub Pages site here**

Siga **UMA** das opções abaixo (não misture as duas).

### Opção A — Pelo GitHub Actions (este repositório já tem o workflow)

1. **Settings** → **Pages**
2. **Build and deployment** → **Source** → escolha **GitHub Actions** (não “None”, não só “Deploy from branch” se quiser usar o workflow)
3. **Settings** → **Actions** → **General** → **Workflow permissions** → **Read and write permissions** → Save
4. Faça um **push** na `main` ou em **Actions** → **Deploy static content to Pages** → **Run workflow**
5. **Importante (1ª vez):** abra o run em **Actions**. Se aparecer **“Waiting for approval”** / **Review deployments** → clique em **Approve and deploy** no environment **github-pages**
6. Espere o job ficar verde e teste o link de novo (pode levar alguns minutos)

### Opção B — Sem Actions (só branch main)

1. **Settings** → **Pages**
2. **Source** → **Deploy from a branch**
3. Branch **`main`**, pasta **`/ (root)`** → Save
4. Se antes estava **GitHub Actions**, **tem que mudar** para esta opção ou o site não sobe por branch
5. Espere alguns minutos e teste o link

### Requisito

No plano **gratuito**, o repositório precisa ser **público** para o GitHub Pages funcionar assim.

**Settings** → **Danger Zone** → repositório **Public**.

---

### Open Graph

`index.html` e `anuncio.html` usam `https://marisacastro03.github.io/faturaodonto/` nas meta tags.

O arquivo **`.nojekyll`** evita o Jekyll alterar o site estático.
