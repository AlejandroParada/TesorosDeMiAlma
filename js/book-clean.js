/**
 * BookReader - KISS y DRY con soporte i18n
 */

class BookReader {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 32;
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.theme = localStorage.getItem('theme') || 'light';
        this.lang = window.I18N?.lang || 'es';
        this.sidebarOpen = window.innerWidth > 768;
        this.base = this.resolveBase();
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
        this.loadChapter(this.getUrlChapter());
        this.updateUI();
        this.setupFullscreenOnStart();
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
        let newChapter = this.currentChapter;
        if (direction === 'prev' && this.currentChapter > 1) {
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
        if (location.protocol.startsWith('http')) {
            const urls = [
                this.url(`content/es/${chapterNumber}.md`),
                this.url(`${chapterNumber}.md`)
            ];
            for (const url of urls) {
                try {
                    const response = await fetch(url, { cache: 'no-store' });
                    if (response.ok) {
                        const text = await response.text();
                        if (text.trim()) return true;
                    }
                } catch (e) {}
            }
        }
        return !!(window.BOOK_CONTENT?.chapters?.[chapterNumber]);
    }

    async loadChapter(chapterNumber) {
        if (chapterNumber < 1 || chapterNumber > this.totalChapters) return;
        const content = document.getElementById('chapter-content');
        if (!content) return;

        try {
            content.innerHTML = `<div class="loading">${this.t('loading')}</div>`;
            const chapterContent = await this.getContent(chapterNumber);
            content.innerHTML = this.parseMarkdown(chapterContent);
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

    async getContent(chapterNumber) {
        const lang = this.lang || 'es';

        if (location.protocol.startsWith('http')) {
            const urls = [
                this.url(`content/${lang}/${chapterNumber}.md`),
                lang === 'es' ? this.url(`${chapterNumber}.md`) : null
            ].filter(Boolean);

            for (const url of urls) {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        const text = await response.text();
                        // Ignorar archivos que solo tienen el título (contenido incompleto)
                        const lines = text.trim().split('\n').filter(l => l.trim());
                        if (lines.length > 1) return text;
                    }
                } catch (e) {}
            }
        }

        // Contenido embebido (solo español de respaldo)
        if (lang === 'es' && window.BOOK_CONTENT?.chapters?.[chapterNumber]) {
            const ch = window.BOOK_CONTENT.chapters[chapterNumber];
            return `# ${ch.title}\n\n${ch.content}`;
        }

        return `# ${this.t('chapter.label')} ${chapterNumber}\n\n${this.t('content.missing')}`;
    }

    updateUI() {
        this.setText('chapter-indicator', `${this.currentChapter} / ${this.totalChapters}`);
        this.setText('bottom-chapter-current', this.currentChapter);
        this.setText('bottom-chapter-total', this.totalChapters);
        this.setDisabled('bottom-prev', this.currentChapter <= 1);
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

    parseMarkdown(text) {
        return text
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/"([^"]+)" \(([^)]+)\)/g, '<blockquote>"$1" <cite>($2)</cite></blockquote>')
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
        const chapter = parseInt(params.get('chapter')) || 1;
        return (chapter >= 1 && chapter <= this.totalChapters) ? chapter : 1;
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
