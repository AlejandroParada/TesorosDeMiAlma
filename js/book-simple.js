/**
 * Sistema principal del libro - Versión simplificada
 * Funciona completamente sin servidor
 */

class BookReader {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 31;
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.theme = localStorage.getItem('theme') || 'light';
        this.sidebarOpen = window.innerWidth > 768;
        
        this.init();
    }

    /**
     * Inicializar el lector del libro
     */
    async init() {
        this.setupEventListeners();
        this.applyTheme();
        this.applyFontSize();
        this.setupSidebar();
        await this.loadChapterList();
        this.loadChapter(1);
        this.updateNavigation();
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Navegación de capítulos
        document.getElementById('prev-chapter')?.addEventListener('click', () => {
            this.navigateChapter('prev');
        });

        document.getElementById('next-chapter')?.addEventListener('click', () => {
            this.navigateChapter('next');
        });

        // Control de tema
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Control de fuente
        document.getElementById('font-increase')?.addEventListener('click', () => {
            this.adjustFontSize('increase');
        });

        document.getElementById('font-decrease')?.addEventListener('click', () => {
            this.adjustFontSize('decrease');
        });

        // Toggle sidebar
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Botón cerrar sidebar
        document.getElementById('sidebar-close')?.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && e.ctrlKey) {
                e.preventDefault();
                this.navigateChapter('prev');
            } else if (e.key === 'ArrowRight' && e.ctrlKey) {
                e.preventDefault();
                this.navigateChapter('next');
            } else if (e.key === 'F1') {
                e.preventDefault();
                this.toggleSidebar();
            }
        });

        // Responsive - cerrar sidebar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                const sidebarClose = document.getElementById('sidebar-close');
                
                if (!sidebar.contains(e.target) && 
                    e.target !== sidebarToggle && 
                    e.target !== sidebarClose &&
                    !e.target.closest('.sidebar-toggle')) {
                    this.closeSidebar();
                }
            }
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Escuchar cambios de idioma
        document.addEventListener('languageChanged', (e) => {
            this.loadChapterList();
            this.loadChapter(this.currentChapter);
        });
    }

    /**
     * Cargar lista de capítulos
     */
    async loadChapterList() {
        const chapterList = document.getElementById('chapter-list');
        chapterList.innerHTML = '';

        for (let i = 1; i <= this.totalChapters; i++) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.dataset.chapter = i;
            link.textContent = `${window.i18n.t('chapter.number')} ${i}`;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const direction = i > this.currentChapter ? 'next' : (i < this.currentChapter ? 'prev' : null);
                this.loadChapter(i, direction);
            });

            listItem.appendChild(link);
            chapterList.appendChild(listItem);
        }
    }

    /**
     * Cargar un capítulo específico
     */
    loadChapter(chapterNumber, direction = null) {
        if (chapterNumber < 1 || chapterNumber > this.totalChapters) {
            this.showError(window.i18n.t('error.chapterNotFound'));
            return;
        }

        const contentElement = document.getElementById('chapter-content');
        
        // Fade out actual
        contentElement.style.opacity = '0';
        contentElement.innerHTML = `<div class="loading" data-i18n="loading">${window.i18n.t('loading')}</div>`;

        // Pequeño delay para mostrar el loading con transición
        setTimeout(async () => {
            try {
                const content = await this.getChapterContent(chapterNumber);
                
                if (content) {
                    this.currentChapter = chapterNumber;
                    this.displayChapter(content, chapterNumber, direction);
                    this.updateNavigation();
                    this.updateChapterList();
                    this.scrollToTop();
                    
                    // Actualizar URL
                    const url = new URL(window.location);
                    url.searchParams.set('chapter', chapterNumber);
                    window.history.replaceState({}, '', url);
                    
                    // Fade in con animación direccional
                    setTimeout(() => {
                        contentElement.style.opacity = '1';
                        if (direction === 'next') {
                            contentElement.classList.add('slide-right');
                        } else if (direction === 'prev') {
                            contentElement.classList.add('slide-left');
                        }
                        
                        // Limpiar clases de animación después
                        setTimeout(() => {
                            contentElement.classList.remove('slide-right', 'slide-left');
                        }, 300);
                    }, 50);
                    
                } else {
                    contentElement.style.opacity = '1';
                    this.showError(window.i18n.t('error.loadChapter'));
                }
            } catch (error) {
                console.error('Error loading chapter:', error);
                contentElement.style.opacity = '1';
                this.showError(window.i18n.t('error.loadChapter'));
            }
        }, 150);
    }

    /**
     * Obtener contenido del capítulo - Versión async para servidor
     */
    async getChapterContent(chapterNumber) {
        // Si tenemos un servidor (protocolo http), intentar cargar desde archivos .md
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            try {
                const response = await fetch(`${chapterNumber}.md`);
                if (response.ok) {
                    return await response.text();
                }
            } catch (error) {
                console.log(`Error loading chapter ${chapterNumber}.md:`, error);
            }
        }

        // Fallback: usar contenido embebido
        if (window.BOOK_CONTENT && window.BOOK_CONTENT.chapters[chapterNumber]) {
            const chapter = window.BOOK_CONTENT.chapters[chapterNumber];
            return `${chapterNumber} ${chapter.title}\n\n${chapter.content}`;
        }
        
        return `${chapterNumber} Capítulo no disponible

Este capítulo no está disponible.

Los archivos .md originales contienen el contenido completo.`;
    }

    /**
     * Mostrar el contenido del capítulo
     */
    displayChapter(content, chapterNumber, direction = null) {
        const contentElement = document.getElementById('chapter-content');
        
        // Verificar si el contenido es muy corto (solo título)
        const lines = content.trim().split('\n').filter(line => line.trim());
        if (lines.length === 1) {
            // Solo tiene título, mostrar mensaje informativo
            const title = lines[0];
            content = `${title}

*Este capítulo aún está en desarrollo.*

El archivo original (\`${chapterNumber}.md\`) contiene solo el título. El contenido completo se agregará próximamente.

---

**Navegación:**
- Use las flechas ◀ ▶ para navegar entre capítulos
- Presione **Ctrl + ←/→** para navegación rápida
- El **Capítulo 1** y **Capítulo 2** tienen contenido completo
- El **Capítulo 5** también tiene una historia completa

¡Gracias por su paciencia mientras completamos todos los capítulos!`;
        }
        
        // Parsear el contenido markdown básico
        const html = this.parseMarkdown(content);
        
        contentElement.innerHTML = html;
        
        // Cerrar sidebar en móvil después de cargar capítulo
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.closeSidebar();
            }, 100);
        }
    }

    /**
     * Parser básico de Markdown
     */
    parseMarkdown(text) {
        return text
            // Encabezados
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Enlaces
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Texto en negrita
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Texto en cursiva
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Código inline
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Líneas horizontales
            .replace(/^---$/gim, '<hr>')
            // Citas con comillas
            .replace(/"([^"]+)" \(([^)]+)\)/g, '<blockquote>"$1" <cite>($2)</cite></blockquote>')
            // Citas simples
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Párrafos
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (!paragraph) return '';
                if (paragraph.startsWith('<')) return paragraph;
                return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
            })
            .join('\n');
    }

    /**
     * Mostrar error
     */
    showError(message) {
        const contentElement = document.getElementById('chapter-content');
        contentElement.innerHTML = `<div class="error">${message}</div>`;
    }

    /**
     * Navegar entre capítulos
     */
    navigateChapter(direction) {
        let newChapter = this.currentChapter;
        
        if (direction === 'prev' && this.currentChapter > 1) {
            newChapter = this.currentChapter - 1;
        } else if (direction === 'next' && this.currentChapter < this.totalChapters) {
            newChapter = this.currentChapter + 1;
        }

        if (newChapter !== this.currentChapter) {
            this.loadChapter(newChapter, direction);
        }
    }

    /**
     * Actualizar navegación
     */
    updateNavigation() {
        const prevBtn = document.getElementById('prev-chapter');
        const nextBtn = document.getElementById('next-chapter');
        const indicator = document.getElementById('chapter-indicator');

        if (prevBtn) {
            prevBtn.disabled = this.currentChapter <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentChapter >= this.totalChapters;
        }

        if (indicator) {
            indicator.textContent = `${this.currentChapter} / ${this.totalChapters}`;
        }
    }

    /**
     * Actualizar lista de capítulos
     */
    updateChapterList() {
        const links = document.querySelectorAll('#chapter-list a');
        links.forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.dataset.chapter) === this.currentChapter) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Cambiar tema
     */
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }

    /**
     * Aplicar tema
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
            }
        }
    }

    /**
     * Ajustar tamaño de fuente
     */
    adjustFontSize(direction) {
        const sizes = ['small', 'normal', 'large', 'extra-large'];
        let currentIndex = sizes.indexOf(this.fontSize);
        
        if (direction === 'increase' && currentIndex < sizes.length - 1) {
            currentIndex++;
        } else if (direction === 'decrease' && currentIndex > 0) {
            currentIndex--;
        }

        this.fontSize = sizes[currentIndex];
        this.applyFontSize();
        localStorage.setItem('fontSize', this.fontSize);
    }

    /**
     * Aplicar tamaño de fuente
     */
    applyFontSize() {
        document.body.className = document.body.className.replace(/font-size-\w+/g, '');
        if (this.fontSize !== 'normal') {
            document.body.classList.add(`font-size-${this.fontSize}`);
        }
    }

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        if (window.innerWidth <= 768) {
            this.toggleMobileSidebar();
        } else {
            this.sidebarOpen = !this.sidebarOpen;
            this.updateSidebar();
        }
    }

    /**
     * Toggle mobile sidebar
     */
    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const appBody = document.querySelector('.app-body');
        
        sidebar.classList.toggle('mobile-open');
        
        let overlay = document.querySelector('.mobile-overlay');
        if (sidebar.classList.contains('mobile-open')) {
            // Crear overlay si no existe
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'mobile-overlay';
                appBody.appendChild(overlay);
                overlay.addEventListener('click', () => this.closeSidebar());
            }
            overlay.classList.add('active');
            
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        } else {
            if (overlay) {
                overlay.classList.remove('active');
            }
            // Restaurar scroll del body
            document.body.style.overflow = '';
        }
    }

    /**
     * Cerrar sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const appBody = document.querySelector('.app-body');
        
        sidebar.classList.remove('mobile-open');
        
        const overlay = document.querySelector('.mobile-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Añadir clase para animación suave
        if (appBody) {
            appBody.classList.remove('sidebar-collapsed');
        }
    }

    /**
     * Actualizar sidebar para desktop
     */
    updateSidebar() {
        const sidebar = document.getElementById('sidebar');
        const appBody = document.querySelector('.app-body');
        
        if (this.sidebarOpen) {
            sidebar.classList.remove('sidebar-collapsed');
            if (appBody) appBody.classList.remove('sidebar-collapsed');
        } else {
            sidebar.classList.add('sidebar-collapsed');
            if (appBody) appBody.classList.add('sidebar-collapsed');
        }
    }

    /**
     * Configurar sidebar inicial
     */
    setupSidebar() {
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        } else {
            this.updateSidebar();
        }
    }

    /**
     * Manejar resize de ventana
     */
    handleResize() {
        if (window.innerWidth <= 768) {
            // Modo móvil
            this.closeSidebar();
            this.sidebarOpen = true; // Reset para próximo toggle
        } else {
            // Modo desktop
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('mobile-open');
            this.updateSidebar();
            
            // Limpiar overlay y restaurar body
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) {
                overlay.remove();
            }
            document.body.style.overflow = '';
        }
    }

    /**
     * Scroll al inicio
     */
    scrollToTop() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    /**
     * Obtener capítulo desde URL
     */
    getChapterFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const chapter = parseInt(urlParams.get('chapter'));
        return chapter && chapter >= 1 && chapter <= this.totalChapters ? chapter : 1;
    }
}

// Instancia global del lector
window.bookReader = new BookReader();