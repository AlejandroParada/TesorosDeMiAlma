/**
 * BookReader - KISS y DRY con soporte i18n
 */

class BookReader {
    constructor() {
        this.currentChapter = -2; // Empezar con la portada
        this.totalChapters = 33;
        this.hasIntroduction = true; // Flag para indicar que hay introducción
        this.hasPortada = true; // Flag para portada
        this.hasDedicatoria = true; // Flag para dedicatoria
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.theme = localStorage.getItem('theme') || 'light';
        this.lang = window.I18N?.lang || 'es';
        this.sidebarOpen = window.innerWidth > 768;
        this.base = this.resolveBase();
        this.contentCache = new Map();
        this.inflight = new Map();
        this.loadSeq = 0;
        this.prefetchToken = 0;
        this.init();
    }

    // Base URL para GitHub Pages (project site: /RepoName/) y local
    resolveBase() {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            const src = scripts[i].src || '';
            if (src.includes('book-clean.js')) {
                return src.replace(/js\/book-clean\.js.*$/i, '');
            }
        }
        const path = location.pathname;
        if (path.endsWith('/')) return path;
        if (path.endsWith('.html')) return path.replace(/[^/]+$/, '');
        return path.replace(/\/?$/, '/');
    }

    url(path) {
        const clean = String(path).replace(/^\//, '');
        return this.base + clean;
    }

    async init() {
        this.setupEvents();
        this.applySettings();
        this.applyLanguage();
        await this.detectTotalChapters();
        this.loadChapterList();
        await this.loadChapter(this.getUrlChapter() ?? -2); // Empezar con portada por defecto
        this.updateUI();
        this.setupFullscreenOnStart();
        this.prefetchChapters();
    }

    setupEvents() {
        this.on('bottom-prev', 'click', () => {
            this.enterFullscreen();
            this.navigate('prev');
        });
        this.on('bottom-next', 'click', () => {
            this.enterFullscreen();
            this.navigate('next');
        });
        this.on('theme-toggle', 'click', () => this.toggleTheme());
        this.on('font-increase', 'click', () => this.adjustFont('increase'));
        this.on('font-decrease', 'click', () => this.adjustFont('decrease'));
        this.on('sidebar-toggle', 'click', () => this.toggleSidebar());
        this.on('sidebar-close', 'click', () => this.closeSidebar());
        this.setupLanguageMenu();

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                if (e.key === 'ArrowLeft') { e.preventDefault(); this.navigate('prev'); }
                if (e.key === 'ArrowRight') { e.preventDefault(); this.navigate('next'); }
            }
        });

        window.addEventListener('resize', () => this.handleResize());
        this.setupPageNumberRefresh();
    }

    on(id, event, callback) {
        const element = document.getElementById(id);
        if (element) element.addEventListener(event, callback);
    }

    setupLanguageMenu() {
        const btn = document.getElementById('lang-toggle');
        const menu = document.getElementById('lang-menu');
        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });

        menu.querySelectorAll('[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setLanguage(item.dataset.lang);
                menu.classList.remove('open');
            });
        });

        document.addEventListener('click', () => menu.classList.remove('open'));
    }

    setLanguage(code) {
        if (!window.I18N || !window.I18N.languages.includes(code)) return;
        this.lang = code;
        window.I18N.lang = code;
        this.applyLanguage();
        this.loadChapterList();
        this.loadChapter(this.currentChapter);
        this.updateUI();
        this.prefetchChapters();
    }

    applyLanguage() {
        if (window.I18N) window.I18N.apply();
        this.updateLangMenuActive();
    }

    updateLangMenuActive() {
        document.querySelectorAll('#lang-menu [data-lang]').forEach(item => {
            item.classList.toggle('active', item.dataset.lang === this.lang);
        });
    }

    t(key) {
        return window.I18N ? window.I18N.t(key) : key;
    }

    navigate(direction) {
        const minChapter = this.hasIntroduction ? 0 : 1;
        let newChapter = this.currentChapter;
        
        if (direction === 'prev' && this.currentChapter > minChapter) {
            newChapter = this.currentChapter - 1;
        } else if (direction === 'next' && this.currentChapter < this.totalChapters) {
            newChapter = this.currentChapter + 1;
        } else {
            return;
        }
        this.loadChapter(newChapter);
    }

    enterFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement) return;

        const el = document.documentElement;
        const request = el.requestFullscreen
            || el.webkitRequestFullscreen
            || el.msRequestFullscreen;

        if (!request) return;

        try {
            const result = request.call(el);
            if (result && typeof result.catch === 'function') {
                result.catch(() => {});
            }
        } catch (e) {
            // Sin gesto de usuario el navegador lo rechaza
        }
    }

    setupFullscreenOnStart() {
        // Solo con gesto del usuario (sin intento al cargar = sin error en consola)
        const start = () => {
            this.enterFullscreen();
            document.removeEventListener('pointerdown', start, true);
            document.removeEventListener('keydown', start, true);
        };

        document.addEventListener('pointerdown', start, true);
        document.addEventListener('keydown', start, true);
    }

    async detectTotalChapters() {
        // Partir del total conocido y solo sondear hacia atrás/adelante (más rápido en GitHub Pages)
        let count = this.totalChapters;
        while (count > 0 && !(await this.chapterExists(count))) {
            count--;
        }
        for (let i = count + 1; i <= count + 50; i++) {
            if (!(await this.chapterExists(i))) break;
            count = i;
        }
        if (count > 0) this.totalChapters = count;
    }

    async chapterExists(chapterNumber) {
        // Fuente canónica ES: content/es/ (sin duplicados en raíz)
        if (location.protocol.startsWith('http')) {
            const path = `content/es/${chapterNumber}.md`;
            if (this.contentCache.get(path)) return true;
            try {
                const response = await fetch(this.url(path));
                if (response.ok) {
                    const text = await response.text();
                    const useful = this.usefulMarkdown(text);
                    if (useful) this.contentCache.set(path, useful);
                    if (text.trim()) return true;
                }
            } catch (e) {}
        }
        return !!(window.BOOK_CONTENT?.chapters?.[chapterNumber]);
    }

    async loadChapter(chapterNumber) {
        // Permitir portada (-2), dedicatoria (-1), introducción (0)
        const minChapter = this.hasPortada ? -2 : (this.hasDedicatoria ? -1 : (this.hasIntroduction ? 0 : 1));
        if (chapterNumber < minChapter || chapterNumber > this.totalChapters) return;
        const content = document.getElementById('chapter-content');
        if (!content) return;

        const requestId = ++this.loadSeq;
        const cached = this.contentCache.get(this.contentPath(chapterNumber));

        try {
            if (!cached) {
                content.innerHTML = `<div class="loading">${this.t('loading')}</div>`;
            }
            const chapterContent = await this.getContent(chapterNumber);
            if (requestId !== this.loadSeq) return;
            // Portada / HTML embebido: no pasar por el parser de markdown
            content.innerHTML = this.isRawHtml(chapterContent)
                ? chapterContent
                : this.parseMarkdown(chapterContent);
            this.currentChapter = chapterNumber;
            this.updateUI();
            this.updateUrl();
            this.closeSidebar();
            if (window.glossaryManager) {
                window.glossaryManager.refresh();
            }
        } catch (error) {
            content.innerHTML = `<div class="error">${this.t('error')}: ${error.message}</div>`;
        }
    }

    contentPath(chapterNumber, lang = this.lang || 'es') {
        if (chapterNumber === -2) return `content/${lang}/portada.md`;
        if (chapterNumber === -1) return `content/${lang}/dedicatoria.md`;
        if (chapterNumber === 0) return `content/${lang}/introduccion.md`;
        return `content/${lang}/${chapterNumber}.md`;
    }

    async getContent(chapterNumber) {
        const lang = this.lang || 'es';

        // Contenido solo desde content/{lang}/ (DRY: sin duplicados en raíz)
        const text = await this.fetchMarkdown(this.contentPath(chapterNumber, lang));
        if (text) return text;

        if (chapterNumber === -2) return this.getEmbeddedPortada(lang);
        if (chapterNumber === -1) return this.getEmbeddedDedicatoria(lang);
        if (chapterNumber === 0) return this.getEmbeddedIntroduction(lang);

        // Contenido embebido (solo español de respaldo)
        if (lang === 'es' && window.BOOK_CONTENT?.chapters?.[chapterNumber]) {
            const ch = window.BOOK_CONTENT.chapters[chapterNumber];
            return `# ${ch.title}\n\n${ch.content}`;
        }

        return `# ${this.t('chapter.label')} ${chapterNumber}\n\n${this.t('content.missing')}`;
    }

    getEmbeddedIntroduction(language) {
        const introductions = {
            'es': `# Introducción

> **"Mas el que bebiere del agua que yo le daré, no tendrá sed jamás; sino que el agua que yo le daré será en él una fuente de agua que salte para vida eterna."** (Juan 4:14)

> **"Porque donde esté vuestro tesoro, allí estará también vuestro corazón."** (Mateo 6:21)

Querido lector,

Tienes en tus manos una colección de relatos que nacieron del corazón. **"Tesoros de Mi Alma"** es un cofre lleno de vivencias que han marcado el sendero de fe.

Para ver el contenido completo, instala Python y ejecuta el servidor:
1. python.org/downloads
2. python server.py`,
            'en': `# Introduction

> **"But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life."** (John 4:14)

> **"For where your treasure is, there will your heart be also."** (Matthew 6:21)

Dear Reader,

You hold in your hands a collection of stories that were born from the heart. **"Treasures of My Soul"** is a treasure chest filled with experiences that have marked the path of faith.

To see the complete content, install Python and run the server:
1. python.org/downloads  
2. python server.py`,
            'pt': `# Introdução

> **"Mas aquele que beber da água que eu lhe der nunca terá sede, porque a água que eu lhe der se fará nele uma fonte de água que salte para a vida eterna."** (João 4:14)

> **"Porque onde estiver o vosso tesouro, aí estará também o vosso coração."** (Mateus 6:21)

Querido leitor,

Você tem em suas mãos uma coleção de relatos que nasceram do coração. **"Tesouros da Minha Alma"** é um baú cheio de vivências que marcaram o caminho de fé.

Para ver o conteúdo completo, instale o Python e execute o servidor:
1. python.org/downloads
2. python server.py`
        };
        
        return introductions[language] || introductions['es'];
    }

    getEmbeddedPortada(language) {
        const portadas = {
            'es': `<div class="book-cover-page">
    <img src="assets/portada.jpg" alt="Portada del libro - Cristo consolando">
    <div class="cover-overlay">
        <h1 class="cover-title">Tesoros de Mi Alma</h1>
        <p class="cover-subtitle">Relatos de fe, esperanza y testimonio</p>
    </div>
</div>`,
            'en': `<div class="book-cover-page">
    <img src="assets/portada.jpg" alt="Book cover - Christ comforting">
    <div class="cover-overlay">
        <h1 class="cover-title">Treasures of My Soul</h1>
        <p class="cover-subtitle">Stories of faith, hope and testimony</p>
    </div>
</div>`,
            'pt': `<div class="book-cover-page">
    <img src="assets/portada.jpg" alt="Capa do livro - Cristo consolando">
    <div class="cover-overlay">
        <h1 class="cover-title">Tesouros da Minha Alma</h1>
        <p class="cover-subtitle">Relatos de fé, esperança e testemunho</p>
    </div>
</div>`
        };
        return portadas[language] || portadas['es'];
    }

    getEmbeddedDedicatoria(language) {
        const dedicatorias = {
            'es': `# Dedicatoria

<div class="dedication-page">
    <div class="dedication-content">
        <p class="dedication-text">
            A Mahana Cruzado que me ha impulsado y dio<br>
            en "el clavo" de lo que necesitaba, y que me<br>
            ha motivado a terminar de publicar este libro,<br>
            en esta versión.<br>           
        </p>
        
        <p class="dedication-text">
            A todos aquellos que buscan reconocer<br>
            la mano del Señor en su propia historia,<br>
            porque también en sus vidas comunes<br>
            hay tesoros esperando ser descubiertos.
        </p>
        
        <div class="dedication-signature">
            <p>Con mucho agradecimiento y aprecio,</p>
            <p><em>Alejandro Parada</em></p>
        </div>
    </div>
</div>`,
            'en': `# Dedication

<div class="dedication-page">
    <div class="dedication-content">
        <p class="dedication-text">
            To Mahana Cruzado who has encouraged me and hit<br>
            "the nail on the head" with what I needed, and who<br>
            has motivated me to finish publishing this book,<br>
            in this version.<br>           
        </p>
        
        <p class="dedication-text">
            To all those who seek to recognize<br>
            the Lord's hand in their own story,<br>
            because in their ordinary lives too<br>
            there are treasures waiting to be discovered.
        </p>
        
        <div class="dedication-signature">
            <p>With much gratitude and appreciation,</p>
            <p><em>Alejandro Parada</em></p>
        </div>
    </div>
</div>`,
            'pt': `# Dedicatória

<div class="dedication-page">
    <div class="dedication-content">
        <p class="dedication-text">
            A Mahana Cruzado que me encorajou e acertou<br>
            "na mosca" sobre o que eu precisava, e que<br>
            me motivou a terminar de publicar este livro,<br>
            nesta versão.<br>           
        </p>
        
        <p class="dedication-text">
            A todos aqueles que buscam reconhecer<br>
            a mão do Senhor em sua própria história,<br>
            porque também em suas vidas comuns<br>
            há tesouros esperando ser descobertos.
        </p>
        
        <div class="dedication-signature">
            <p>Com muito agradecimento e apreço,</p>
            <p><em>Alejandro Parada</em></p>
        </div>
    </div>
</div>`
        };
        return dedicatorias[language] || dedicatorias['es'];
    }

    updateUI() {
        const minChapter = this.hasPortada ? -2 : (this.hasDedicatoria ? -1 : (this.hasIntroduction ? 0 : 1));
        
        if (this.currentChapter === -2) {
            this.setText('chapter-indicator', this.t('cover') || 'Portada');
            this.setText('bottom-chapter-current', this.t('cover') || 'Portada');
        } else if (this.currentChapter === -1) {
            this.setText('chapter-indicator', this.t('dedication') || 'Dedicatoria');
            this.setText('bottom-chapter-current', this.t('dedication') || 'Dedic.');
        } else if (this.currentChapter === 0) {
            this.setText('chapter-indicator', this.t('introduction') || 'Introducción');
            this.setText('bottom-chapter-current', this.t('introduction') || 'Intro');
        } else {
            this.setText('chapter-indicator', `${this.currentChapter} / ${this.totalChapters}`);
            this.setText('bottom-chapter-current', this.currentChapter);
        }
        
        this.setText('bottom-chapter-total', this.totalChapters);
        this.setDisabled('bottom-prev', this.currentChapter <= minChapter);
        this.setDisabled('bottom-next', this.currentChapter >= this.totalChapters);
        this.updateSidebarActive();
    }

    updateSidebarActive() {
        document.querySelectorAll('#chapter-list a').forEach(link => {
            const isActive = parseInt(link.dataset.chapter) === this.currentChapter;
            link.classList.toggle('active', isActive);
        });
    }

    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    setDisabled(id, disabled) {
        const el = document.getElementById(id);
        if (el) el.disabled = disabled;
    }

    loadChapterList() {
        const list = document.getElementById('chapter-list');
        if (!list) return;
        list.innerHTML = '';
        const label = this.t('chapter.label');

        // Añadir portada si existe
        if (this.hasPortada) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.chapter = -2;
            a.textContent = this.t('cover') || 'Portada';
            a.onclick = (e) => {
                e.preventDefault();
                this.loadChapter(-2);
            };
            li.appendChild(a);
            list.appendChild(li);
        }

        // Añadir dedicatoria si existe
        if (this.hasDedicatoria) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.chapter = -1;
            a.textContent = this.t('dedication') || 'Dedicatoria';
            a.onclick = (e) => {
                e.preventDefault();
                this.loadChapter(-1);
            };
            li.appendChild(a);
            list.appendChild(li);
        }

        // Añadir introducción si existe
        if (this.hasIntroduction) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.chapter = 0;
            a.textContent = this.t('introduction') || 'Introducción';
            a.onclick = (e) => {
                e.preventDefault();
                this.loadChapter(0);
            };
            li.appendChild(a);
            list.appendChild(li);
        }

        for (let i = 1; i <= this.totalChapters; i++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.chapter = i;
            a.textContent = `${label} ${i}`;
            a.onclick = (e) => {
                e.preventDefault();
                this.loadChapter(i);
            };
            li.appendChild(a);
            list.appendChild(li);
        }
    }

    /** True si el contenido ya es HTML (p. ej. portada). */
    isRawHtml(text) {
        return /^\s*</.test(String(text || ''));
    }

    /** Texto usable, o null si está vacío o es un stub de solo título. */
    usefulMarkdown(text) {
        if (!text || !String(text).trim()) return null;
        if (this.isRawHtml(text)) return text;
        const lines = text.trim().split('\n').filter(l => l.trim());
        return lines.length > 1 ? text : null;
    }

    /** Carga markdown/HTML desde content/{lang}/…; null si no hay contenido útil. */
    async fetchMarkdown(relativePath) {
        if (!location.protocol.startsWith('http')) return null;
        if (this.contentCache.has(relativePath)) {
            return this.contentCache.get(relativePath);
        }
        if (this.inflight.has(relativePath)) {
            return this.inflight.get(relativePath);
        }
        const pending = this.loadMarkdown(relativePath);
        this.inflight.set(relativePath, pending);
        try {
            return await pending;
        } finally {
            this.inflight.delete(relativePath);
        }
    }

    async loadMarkdown(relativePath) {
        try {
            const response = await fetch(this.url(relativePath));
            if (!response.ok) {
                this.contentCache.set(relativePath, null);
                return null;
            }
            const useful = this.usefulMarkdown(await response.text());
            this.contentCache.set(relativePath, useful);
            return useful;
        } catch (e) {
            return null;
        }
    }

    /** Tras la primera página, pide el resto del idioma actual sin bloquear la lectura. */
    prefetchChapters() {
        if (!location.protocol.startsWith('http')) return;
        const token = ++this.prefetchToken;
        const lang = this.lang || 'es';
        const nums = [];
        if (this.hasPortada) nums.push(-2);
        if (this.hasDedicatoria) nums.push(-1);
        if (this.hasIntroduction) nums.push(0);
        for (let i = 1; i <= this.totalChapters; i++) nums.push(i);

        const idx = Math.max(0, nums.indexOf(this.currentChapter));
        const paths = [];
        for (let d = 1; d < nums.length; d++) {
            if (idx + d < nums.length) paths.push(this.contentPath(nums[idx + d], lang));
            if (idx - d >= 0) paths.push(this.contentPath(nums[idx - d], lang));
        }

        const start = () => {
            if (token === this.prefetchToken) this.prefetchQueue(paths, token);
        };
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(start, { timeout: 1200 });
        } else {
            setTimeout(start, 300);
        }
    }

    async prefetchQueue(paths, token) {
        const concurrency = 3;
        let cursor = 0;
        const worker = async () => {
            while (cursor < paths.length && token === this.prefetchToken) {
                const path = paths[cursor++];
                if (this.contentCache.has(path)) continue;
                await this.fetchMarkdown(path);
            }
        };
        const workers = Math.min(concurrency, paths.length);
        await Promise.all(Array.from({ length: workers }, () => worker()));
    }

    parseMarkdown(text) {
        return text
            // Links markdown antes de otros transforms (escrituras SUD, etc.)
            .replace(
                /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
            )
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Solo citas planas; no tocar si el paréntesis ya es un <a> (links de escrituras)
            .replace(/"([^"]+)" \(([^)<]+)\)/g, '<blockquote>"$1" <cite>($2)</cite></blockquote>')
            .split('\n\n')
            .map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '')
            .join('');
    }

    applySettings() {
        document.body.classList.toggle('dark-theme', this.theme === 'dark');
        document.body.classList.remove('font-small', 'font-normal', 'font-large', 'font-xl', 'font-xxl', 'font-xxxl', 'font-huge');
        document.body.classList.add(`font-${this.fontSize}`);
        this.updateSidebarState();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applySettings();
    }

    adjustFont(direction) {
        const sizes = ['small', 'normal', 'large', 'xl', 'xxl', 'xxxl', 'huge'];
        const current = sizes.indexOf(this.fontSize);
        if (direction === 'increase' && current < sizes.length - 1) {
            this.fontSize = sizes[current + 1];
        } else if (direction === 'decrease' && current > 0) {
            this.fontSize = sizes[current - 1];
        }
        localStorage.setItem('fontSize', this.fontSize);
        this.applySettings();
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        this.updateSidebarState();
    }

    closeSidebar() {
        if (window.innerWidth <= 768) {
            this.sidebarOpen = false;
            this.updateSidebarState();
        }
    }

    updateSidebarState() {
        const sidebar = document.getElementById('app-sidebar');
        const body = document.body;
        if (sidebar) sidebar.classList.toggle('open', this.sidebarOpen);
        if (body) body.classList.toggle('sidebar-collapsed', !this.sidebarOpen);
    }

    handleResize() {
        this.sidebarOpen = window.innerWidth > 768;
        this.updateSidebarState();
    }

    getUrlChapter() {
        const params = new URLSearchParams(location.search);
        const raw = params.get('chapter');
        if (raw === null || raw === '') return null; // Primera carga: sin parámetro → portada

        const chapter = parseInt(raw, 10);
        if (Number.isNaN(chapter)) return null;

        const minChapter = this.hasPortada ? -2 : (this.hasDedicatoria ? -1 : (this.hasIntroduction ? 0 : 1));
        if (chapter >= minChapter && chapter <= this.totalChapters) return chapter;
        return null;
    }

    updateUrl() {
        const url = new URL(location);
        url.searchParams.set('chapter', this.currentChapter);
        history.replaceState({}, '', url);
    }

    setupPageNumberRefresh() {
        const chapterInfo = document.querySelector('.chapter-info');
        if (!chapterInfo) return;

        chapterInfo.style.cursor = 'pointer';
        chapterInfo.style.userSelect = 'none';

        chapterInfo.addEventListener('click', () => {
            if (window.innerWidth <= 768) location.reload();
        });

        chapterInfo.addEventListener('touchstart', () => {
            if (window.innerWidth <= 768) chapterInfo.style.opacity = '0.7';
        });

        chapterInfo.addEventListener('touchend', () => {
            if (window.innerWidth <= 768) {
                setTimeout(() => { chapterInfo.style.opacity = '1'; }, 100);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bookReader = new BookReader();
});
