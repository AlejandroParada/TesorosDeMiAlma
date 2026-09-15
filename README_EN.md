# 📖 Treasures of My Soul

A responsive digital book with multilingual support (Spanish, English, Portuguese), dark mode, font control, and intuitive navigation.

## ✨ Features

- 📱 **Responsive Design**: Perfectly adapts to mobile, tablets, and desktop
- 🌓 **Dark/Light Mode**: Switch between themes with one click
- 🔤 **Font Control**: Adjust font size (A+ / A-)
- 🌍 **Multilingual**: Support for Spanish, English, and Portuguese
- ⌨️ **Keyboard Shortcuts**: Quick keyboard navigation
- 🎯 **No Dependencies**: Works with pure HTML, CSS, and JavaScript
- 🚀 **Local Server**: Includes simple web server in Python

## 🚀 Quick Start

### Option 1: Simple Server
```bash
python start.py
```

### Option 2: Complete Server
```bash
python server.py
```

### Option 3: Without Python
Open `index.html` directly in your browser (some functions may be limited by CORS).

## 🌐 Publish on GitHub Pages

The project is static (HTML/CSS/JS) and is prepared for GitHub Pages:

### Requirements already included
- `.nojekyll` — prevents Jekyll from processing `.md` files (needed for `fetch`)
- Paths with automatic **base path** (works in `/repo-name/`)
- `404.html` — redirects to app if URL doesn't exist
- Workflow `.github/workflows/pages.yml` — automatic deployment

### Activate Pages (once)
1. Upload repo to GitHub
2. Go to **Settings → Pages**
3. In **Source**, choose **GitHub Actions**
4. Push to `main` (or run workflow manually)
5. URL will be: `https://YOUR-USERNAME.github.io/TesorosDeMiAlma/`

### Alternative without Actions
In **Settings → Pages → Source**, choose branch `main` and folder `/ (root)`.

### Note
Chapters are loaded from `content/es/*.md` (and root `*.md`). With `.nojekyll` GitHub Pages serves them as static files.

## 🎮 Controls and Shortcuts

### Navigation
- **Ctrl + ←**: Previous chapter
- **Ctrl + →**: Next chapter
- **F1**: Show/hide sidebar menu
- **Esc**: Close sidebar menu (on mobile)

### Interface
- **🌙/☀️**: Switch between dark and light mode
- **A+/A-**: Increase/decrease font size
- **🌍**: Language selector (ES/EN/PT)

## 📁 Project Structure

```
TesorosDeMiAlma/
├── index.html              # Main page
├── server.py              # Complete web server
├── start.py               # Simple web server
├── styles/
│   └── main.css           # Main styles
├── js/
│   ├── main.js            # Main JavaScript
│   ├── book.js            # Book logic
│   └── i18n.js            # Internationalization system
├── content/               # Translated content
│   ├── es/               # Spanish (.md files)
│   ├── en/               # English (.md files)
│   └── pt/               # Portuguese (.md files)
├── assets/               # Resources (images, icons)
└── *.md                  # Original files in Spanish
```

## 🌍 Multilingual Support

### Available Languages
- **🇪🇸 Español** (es) - Base language
- **🇺🇸 English** (en) - English
- **🇧🇷 Português** (pt) - Portuguese

### Adding New Languages

1. Create a folder in `content/[language-code]/`
2. Translate the `.md` files from `content/es/`
3. Add translations in `js/i18n.js`:

```javascript
translations = {
    // ... existing languages
    'fr': {  // French
        'site.title': 'Trésors de Mon Âme',
        // ... more translations
    }
}
```

4. Add the option in HTML:
```html
<option value="fr">Français</option>
```

## 🎨 Customization

### Themes
The theme system uses CSS variables. You can customize colors by editing `styles/main.css`:

```css
:root {
    --color-primary: #your-color;
    --bg-primary: #your-background;
    /* ... more variables */
}
```

### Content
- Original files are in the root (`1.md`, `2.md`, etc.)
- Translations go in `content/[language]/`
- The system automatically loads the selected language

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px - Visible sidebar, complete navigation
- **Tablet**: 768px - 1024px - Adapted sidebar
- **Mobile**: < 768px - Collapsible sidebar, optimized navigation

### Mobile Features
- Sliding sidebar menu
- Touch-optimized controls
- Gesture navigation
- Overlay to close menu

## 🔧 Technical Requirements

### Minimum
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+)
- For server: Python 3.6+

### Recommended
- Updated browser
- Python 3.8+
- Local connection (to load .md files)

## 🤝 Contribution

### Adding Chapters
1. Create the numbered `.md` file (e.g., `32.md`)
2. Add it to all language folders
3. Update `totalChapters` in `js/book.js`

### Translations
1. Translate content maintaining structure
2. Update `js/i18n.js` with new interface texts
3. Test in browser

### Improvements
- Fork the project
- Create a branch for your feature
- Commit and push
- Create a Pull Request

## 📜 License

This project is under the license specified by the author.

## 🙏 Acknowledgments

- Created with love and dedication
- No external frameworks for simplicity
- Designed to be accessible and easy to use

---

**📖 Enjoy reading "Treasures of My Soul"**