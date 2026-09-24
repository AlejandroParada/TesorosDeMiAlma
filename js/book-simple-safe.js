/**
 * Sistema del libro - Versión simplificada y completamente segura
 */

class BookReader {
    constructor() {
        console.log('📖 Inicializando BookReader de forma segura...');
        
        // Inicialización completamente segura
        this.currentChapter = 1;
        this.totalChapters = 31;
        this.chapters = this.createChaptersSafe();
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.theme = localStorage.getItem('theme') || 'light';
        this.sidebarOpen = window.innerWidth > 768;
        
        console.log('✅ Constructor completado. Estado:', {
            chapters_length: this.chapters.length,
            totalChapters: this.totalChapters,
            currentChapter: this.currentChapter
        });
        
        this.init();
    }

    createChaptersSafe() {
        console.log('📚 Creando estructura de capítulos segura...');
        const chapters = [];
        
        for (let i = 1; i <= 31; i++) {
            chapters.push({
                number: i,
                title: `Capítulo ${i}`,
                file: `chapter${i}.md`
            });
        }
        
        console.log('✅ Capítulos creados:', chapters.length);
        return chapters;
    }

    async init() {
        console.log('🚀 Inicializando aplicación...');
        
        try {
            this.setupEventListeners();
            this.applyTheme();
            this.applyFontSize();
            this.setupSidebar();
            await this.loadChapterList();
            
            // Cargar capítulo inicial
            const urlChapter = this.getChapterFromURL();
            await this.loadChapter(urlChapter);
            
            // Configurar navegación
            this.setupBottomNavigation();
            this.updateNavigation();
            
            console.log('✅ Aplicación inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error en inicialización:', error);
        }
    }

    getChapterFromURL() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const chapter = parseInt(urlParams.get('chapter')) || 1;
            return (chapter >= 1 && chapter <= this.totalChapters) ? chapter : 1;
        } catch (error) {
            console.warn('⚠️ Error obteniendo capítulo desde URL:', error);
            return 1;
        }
    }

    async loadChapterList() {
        console.log('📋 Cargando lista de capítulos...');
        
        const chapterList = document.getElementById('chapter-list');
        if (!chapterList) {
            console.error('❌ No se encontró #chapter-list');
            return;
        }

        chapterList.innerHTML = '';

        for (let i = 1; i <= this.totalChapters; i++) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.dataset.chapter = i;
            link.textContent = `${window.i18n?.t('chapter.number') || 'Capítulo'} ${i}`;
            
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log(`🔗 Clic en capítulo ${i}`);
                const direction = i > this.currentChapter ? 'next' : (i < this.currentChapter ? 'prev' : null);
                await this.loadChapter(i, direction);
                this.updateNavigation();
            });
            
            listItem.appendChild(link);
            chapterList.appendChild(listItem);
        }
        
        console.log('✅ Lista de capítulos cargada');
    }

    async loadChapter(chapterNumber, direction = null) {
        console.log(`🔄 Cargando capítulo ${chapterNumber}...`);
        
        const contentElement = document.getElementById('chapter-content');
        if (!contentElement) {
            console.error('❌ No se encontró #chapter-content');
            return;
        }
        
        // Validar número de capítulo
        if (chapterNumber < 1 || chapterNumber > this.totalChapters) {
            console.error(`❌ Número de capítulo inválido: ${chapterNumber}`);
            return;
        }
        
        try {
            // Mostrar loading
            contentElement.style.opacity = '0.5';
            contentElement.innerHTML = `<div class="loading">Cargando capítulo ${chapterNumber}...</div>`;

            const content = await this.getChapterContent(chapterNumber);
            
            if (content && content.trim()) {
                this.currentChapter = chapterNumber;
                this.displayChapter(content, chapterNumber, direction);
                this.updateNavigation();
                this.scrollToTop();
                
                // Actualizar URL
                const url = new URL(window.location);
                url.searchParams.set('chapter', chapterNumber);
                window.history.replaceState({}, '', url);
                
                contentElement.style.opacity = '1';
                console.log(`✅ Capítulo ${chapterNumber} cargado exitosamente`);
            } else {
                throw new Error('Contenido vacío');
            }
            
        } catch (error) {
            console.error(`❌ Error cargando capítulo ${chapterNumber}:`, error);
            contentElement.style.opacity = '1';
            this.showError(`Error al cargar el capítulo ${chapterNumber}: ${error.message}`);
        }
    }

    async getChapterContent(chapterNumber) {
        console.log(`🔍 Obteniendo contenido para capítulo ${chapterNumber}...`);
        
        // Método 1: Desde servidor HTTP
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            try {
                const response = await fetch(`content/es/${chapterNumber}.md`);
                if (response.ok) {
                    const content = await response.text();
                    if (content.trim()) {
                        console.log(`✅ Contenido HTTP: ${content.length} caracteres`);
                        return content;
                    }
                }
            } catch (error) {
                console.log(`⚠️ Error HTTP: ${error.message}`);
            }
        }

        // Método 2: Contenido embebido
        if (window.BOOK_CONTENT && window.BOOK_CONTENT.chapters) {
            const chapter = window.BOOK_CONTENT.chapters[chapterNumber];
            if (chapter && chapter.title && chapter.content) {
                console.log(`✅ Contenido embebido: ${chapter.content.length} caracteres`);
                return `# ${chapter.title}\n\n${chapter.content}`;
            }
        }

        // Método 3: Contenido por defecto
        console.log('⚠️ Usando contenido por defecto');
        return `# Capítulo ${chapterNumber}\n\nEste capítulo no está disponible actualmente.`;
    }

    displayChapter(content, chapterNumber, direction = null) {
        console.log(`🖼️ Mostrando capítulo ${chapterNumber}...`);
        
        const contentElement = document.getElementById('chapter-content');
        if (!contentElement) return;

        // Parsear markdown básico
        const html = this.parseMarkdown(content);
        contentElement.innerHTML = html;
        
        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
        
        console.log(`✅ Capítulo ${chapterNumber} mostrado`);
    }

    parseMarkdown(text) {
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/"([^"]+)" \(([^)]+)\)/g, '<blockquote>"$1" <cite>($2)</cite></blockquote>')
            .split('\n\n')
            .map(paragraph => paragraph.trim() ? `<p>${paragraph.replace(/\n/g, '<br>')}</p>` : '')
            .join('');
    }

    updateNavigation() {
        console.log('🔄 Actualizando navegación...');
        
        // Indicador superior
        const indicator = document.getElementById('chapter-indicator');
        if (indicator) {
            indicator.textContent = `${this.currentChapter} / ${this.totalChapters}`;
        }

        // Barra inferior
        const bottomCurrent = document.getElementById('bottom-chapter-current');
        const bottomTotal = document.getElementById('bottom-chapter-total');
        const bottomPrev = document.getElementById('bottom-prev');
        const bottomNext = document.getElementById('bottom-next');

        if (bottomCurrent) bottomCurrent.textContent = this.currentChapter;
        if (bottomTotal) bottomTotal.textContent = this.totalChapters;
        
        if (bottomPrev) {
            bottomPrev.disabled = this.currentChapter <= 1;
        }
        
        if (bottomNext) {
            bottomNext.disabled = this.currentChapter >= this.totalChapters;
        }

        // Actualizar sidebar
        this.updateChapterList();
        
        console.log(`✅ Navegación actualizada: ${this.currentChapter}/${this.totalChapters}`);
    }

    updateChapterList() {
        const links = document.querySelectorAll('#chapter-list a');
        links.forEach(link => {
            link.classList.remove('active');
            const chapterNumber = parseInt(link.dataset.chapter);
            if (chapterNumber === this.currentChapter) {
                link.classList.add('active');
            }
        });
    }

    navigateChapter(direction) {
        console.log(`🧭 Navegación ${direction} desde capítulo ${this.currentChapter}`);
        
        let newChapter = this.currentChapter;
        
        if (direction === 'prev' && this.currentChapter > 1) {
            newChapter = this.currentChapter - 1;
        } else if (direction === 'next' && this.currentChapter < this.totalChapters) {
            newChapter = this.currentChapter + 1;
        } else {
            console.log('❌ Navegación no válida');
            return;
        }
        
        console.log(`✅ Navegando a capítulo ${newChapter}`);
        this.loadChapter(newChapter, direction);
    }

    setupBottomNavigation() {
        console.log('🔧 Configurando navegación inferior...');
        
        const prevBtn = document.getElementById('bottom-prev');
        const nextBtn = document.getElementById('bottom-next');
        
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                console.log('⬅️ Clic botón anterior');
                this.navigateChapter('prev');
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                console.log('➡️ Clic botón siguiente');
                this.navigateChapter('next');
            };
        }
        
        console.log('✅ Navegación inferior configurada');
    }

    setupEventListeners() {
        console.log('🎮 Configurando event listeners...');
        
        // Control de tema
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Control de fuente
        const fontInc = document.getElementById('font-increase');
        const fontDec = document.getElementById('font-decrease');
        
        if (fontInc) fontInc.addEventListener('click', () => this.adjustFontSize('increase'));
        if (fontDec) fontDec.addEventListener('click', () => this.adjustFontSize('decrease'));

        // Sidebar
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarClose = document.getElementById('sidebar-close');
        
        if (sidebarToggle) sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        if (sidebarClose) sidebarClose.addEventListener('click', () => this.closeSidebar());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateChapter('prev');
            } else if (e.ctrlKey && e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateChapter('next');
            }
        });

        // Responsive
        window.addEventListener('resize', () => this.handleResize());
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.theme === 'dark');
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyFontSize() {
        document.body.classList.remove('font-small', 'font-normal', 'font-large', 'font-xl');
        document.body.classList.add(`font-${this.fontSize}`);
    }

    adjustFontSize(direction) {
        const sizes = ['small', 'normal', 'large', 'xl'];
        const currentIndex = sizes.indexOf(this.fontSize);
        
        if (direction === 'increase' && currentIndex < sizes.length - 1) {
            this.fontSize = sizes[currentIndex + 1];
        } else if (direction === 'decrease' && currentIndex > 0) {
            this.fontSize = sizes[currentIndex - 1];
        }
        
        localStorage.setItem('fontSize', this.fontSize);
        this.applyFontSize();
    }

    setupSidebar() {
        this.updateSidebarState();
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        this.updateSidebarState();
    }

    closeSidebar() {
        this.sidebarOpen = false;
        this.updateSidebarState();
    }

    updateSidebarState() {
        const sidebar = document.getElementById('app-sidebar');
        const body = document.body;
        
        if (sidebar) {
            sidebar.classList.toggle('open', this.sidebarOpen);
        }
        
        if (body) {
            body.classList.toggle('sidebar-collapsed', !this.sidebarOpen);
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.sidebarOpen = true;
        } else {
            this.sidebarOpen = false;
        }
        this.updateSidebarState();
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        const contentElement = document.getElementById('chapter-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <div class="error-title">Error</div>
                    <div class="error-message">${message}</div>
                    <div class="error-suggestion">
                        Intenta recargar la página o navegar a otro capítulo.
                    </div>
                </div>
            `;
        }
    }
}

// Inicializar cuando el DOM esté listo
window.bookReader = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, inicializando BookReader...');
    try {
        window.bookReader = new BookReader();
    } catch (error) {
        console.error('❌ Error fatal inicializando BookReader:', error);
    }
});