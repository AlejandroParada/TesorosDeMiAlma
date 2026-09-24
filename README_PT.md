# 📖 Tesouros da Minha Alma

Um livro digital responsivo com suporte multilíngue (espanhol, inglês, português), modo escuro, controle de fonte e navegação intuitiva.

## ✨ Características

- 📱 **Design Responsivo**: Adapta-se perfeitamente a celulares, tablets e desktop
- 🌓 **Modo Escuro/Claro**: Alterne entre temas com um clique
- 🔤 **Controle de Fonte**: Ajuste o tamanho da fonte (A+ / A-)
- 🌍 **Multilíngue**: Suporte para Espanhol, Inglês e Português
- ⌨️ **Atalhos de Teclado**: Navegação rápida com teclado
- 🎯 **Sem Dependências**: Funciona com HTML, CSS e JavaScript puro
- 🚀 **Servidor Local**: Inclui servidor web simples em Python

## 🚀 Início Rápido

### Opção 1: Servidor Simples
```bash
python start.py
```

### Opção 2: Servidor Completo
```bash
python server.py
```

### Opção 3: Sem Python
Abra `index.html` diretamente no seu navegador (algumas funções podem estar limitadas por CORS).

## 🌐 Publicar no GitHub Pages

O projeto é estático (HTML/CSS/JS) e está preparado para GitHub Pages:

### Requisitos já incluídos
- `.nojekyll` — evita que Jekyll processe os `.md` (necessários para `fetch`)
- Caminhos com **base path** automático (funciona em `/nome-do-repo/`)
- `404.html` — redireciona para o app se a URL não existir
- Workflow `.github/workflows/pages.yml` — implantação automática

### Ativar Pages (uma vez)
1. Suba o repo para GitHub
2. Vá para **Settings → Pages**
3. Em **Source**, escolha **GitHub Actions**
4. Faça push para `main` (ou execute o workflow manualmente)
5. A URL será: `https://SEU-USUARIO.github.io/TesorosDeMiAlma/`

### Alternativa sem Actions
Em **Settings → Pages → Source**, escolha o branch `main` e pasta `/ (root)`.

### Nota
Os capítulos são carregados de `content/{es,en,pt}/*.md` (fonte única; sem duplicados na raiz). Com `.nojekyll` GitHub Pages os serve como arquivos estáticos.

## 🎮 Controles e Atalhos

### Navegação
- **Ctrl + ←**: Capítulo anterior
- **Ctrl + →**: Próximo capítulo
- **F1**: Mostrar/ocultar menu lateral
- **Esc**: Fechar menu lateral (no móvel)

### Interface
- **🌙/☀️**: Alternar entre modo escuro e claro
- **A+/A-**: Aumentar/diminuir tamanho da fonte
- **🌍**: Seletor de idioma (ES/EN/PT)

## 📁 Estrutura do Projeto

```
TesorosDeMiAlma/
├── index.html              # Página principal
├── server.py              # Servidor web
├── styles/
│   └── simple.css         # Estilos
├── js/
│   ├── book-clean.js      # Lógica do livro (ativo)
│   ├── i18n.js            # Internacionalização
│   ├── glosario.js        # Glossário
│   └── content-data.js    # Fallback offline
├── content/               # Conteúdo canônico (DRY)
│   ├── es/               # Español (idioma base)
│   ├── en/               # English
│   └── pt/               # Português
└── assets/               # Recursos (imagens, ícones)
```

## 🌍 Suporte Multilíngue

### Idiomas Disponíveis
- **🇪🇸 Español** (es) - Idioma base
- **🇺🇸 English** (en) - Inglês
- **🇧🇷 Português** (pt) - Português

### Adicionando Novos Idiomas

1. Crie uma pasta em `content/[codigo-idioma]/`
2. Traduza os arquivos `.md` de `content/es/`
3. Adicione as traduções em `js/i18n.js`:

```javascript
translations = {
    // ... idiomas existentes
    'fr': {  // Francês
        'site.title': 'Trésors de Mon Âme',
        // ... mais traduções
    }
}
```

4. Adicione a opção no HTML:
```html
<option value="fr">Français</option>
```

## 🎨 Personalização

### Temas
O sistema de temas usa variáveis CSS. Você pode personalizar cores editando `styles/main.css`:

```css
:root {
    --color-primary: #sua-cor;
    --bg-primary: #seu-fundo;
    /* ... mais variáveis */
}
```

### Conteúdo
- A fonte canônica em espanhol está em `content/es/` (`1.md`, `2.md`, `introduccion.md`, etc.)
- As traduções vão em `content/en/` e `content/pt/`
- O sistema carrega automaticamente o idioma selecionado (sem duplicados na raiz)

## 📱 Design Responsivo

### Pontos de Quebra
- **Desktop**: > 1024px - Sidebar visível, navegação completa
- **Tablet**: 768px - 1024px - Sidebar adaptada
- **Mobile**: < 768px - Sidebar recolhível, navegação otimizada

### Características Móveis
- Menu lateral deslizante
- Controles otimizados para toque
- Navegação por gestos
- Overlay para fechar menu

## 🔧 Requisitos Técnicos

### Mínimos
- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 12+)
- Para servidor: Python 3.6+

### Recomendados
- Navegador atualizado
- Python 3.8+
- Conexão local (para carregar arquivos .md)

## 🤝 Contribuição

### Adicionar Capítulos
1. Crie o arquivo `.md` numerado em `content/es/` (ex: `content/es/34.md`)
2. Adicione traduções em `content/en/` e `content/pt/`
3. O leitor detecta capítulos novos em `content/es/` automaticamente

### Traduções
1. Traduza o conteúdo mantendo a estrutura
2. Atualize `js/i18n.js` com novos textos de interface
3. Teste no navegador

### Melhorias
- Fork do projeto
- Crie um branch para sua feature
- Commit e push
- Crie um Pull Request

## 📜 Licença

Este projeto está sob a licença especificada pelo autor.

## 🙏 Agradecimentos

- Criado com amor e dedicação
- Sem frameworks externos por simplicidade
- Projetado para ser acessível e fácil de usar

---

**📖 Desfrute lendo "Tesouros da Minha Alma"**