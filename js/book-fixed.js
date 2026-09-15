/**
 * Sistema del libro - Versión corregida y exhaustiva
 */

class BookReader {
    constructor() {
        console.log('📖 Inicializando BookReader...');
        
        // Inicializar todas las propiedades básicas primero
        this.currentChapter = 1;
        this.totalChapters = 31;
        this.chapters = []; // Array vacío inicial
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.theme = localStorage.getItem('theme') || 'light';
        this.sidebarOpen = window.innerWidth > 768;
        
        // Ahora inicializar estructura de capítulos
        try {
            this.initializeChaptersData();
        } catch (error) {
            console.error('❌ Error inicializando capítulos:', error);
            // Mantener array vacío como fallback
            this.chapters = [];
        }
        
        // Debug info
        console.log('🌐 Protocolo:', window.location.protocol);
        console.log('📍 URL:', window.location.href);
        
        this.init();
    }

    initializeChaptersData() {
        console.log('📚 Inicializando estructura de capítulos de forma síncrona...');
        
        try {
            // Asegurar que this.chapters es un array
            if (!Array.isArray(this.chapters)) {
                this.chapters = [];
            }
            
            // Limpiar array existente
            this.chapters.length = 0;
            
            // Crear estructura de capítulos
            const totalChaps = this.totalChapters || 31;
            for (let i = 1; i <= totalChaps; i++) {
                this.chapters.push({
                    number: i,
                    title: `Capítulo ${i}`,
                    file: `chapter${i}.md`
                });
            }
            
            console.log('✅ Estructura de capítulos creada:', {
                isArray: Array.isArray(this.chapters),
                length: this.chapters.length,
                totalChapters: this.totalChapters,
                firstChapter: this.chapters[0] || 'No disponible'
            });
            
        } catch (error) {
            console.error('❌ Error en initializeChaptersData:', error);
            // Fallback seguro
            this.chapters = [];
            for (let i = 1; i <= 31; i++) {
                this.chapters.push({ number: i, title: `Capítulo ${i}`, file: `chapter${i}.md` });
            }
        }
    }

    async init() {
        console.log('🚀 Inicializando aplicación...');
        
        // Test de diagnóstico inicial
        console.log('🧪 === DIAGNÓSTICO INICIAL ===');
        console.log('📊 Estado de datos:', {
            BOOK_CONTENT_exists: !!window.BOOK_CONTENT,
            chapters_structure: window.BOOK_CONTENT?.chapters ? Object.keys(window.BOOK_CONTENT.chapters) : 'No disponible',
            chapters_count: window.BOOK_CONTENT?.chapters ? Object.keys(window.BOOK_CONTENT.chapters).length : 0,
            sample_chapter: window.BOOK_CONTENT?.chapters?.[1] ? 'Capítulo 1 disponible' : 'Capítulo 1 no disponible'
        });
        
        console.log('📊 Estado interno:', {
            chapters_is_array: Array.isArray(this.chapters),
            chapters_length: this.chapters ? this.chapters.length : 'undefined',
            currentChapter: this.currentChapter,
            totalChapters: this.totalChapters
        });
        
        this.setupEventListeners();
        this.applyTheme();
        this.applyFontSize();
        this.setupSidebar();
        await this.loadChapterList();
        
        // Cargar capítulo inicial desde URL o capítulo 1
        const urlChapter = this.getChapterFromURL();
        
        // Cargar capítulo inicial
        await this.loadChapter(urlChapter);
        
        // Configurar navegación DESPUÉS de cargar para asegurar que los elementos existan
        this.setupBottomNavigation();
        this.updateNavigation();
        
        // Test de verificación después de 1 segundo
        setTimeout(() => {
            this.verifyBottomNavigation();
        }, 1000);
        
        console.log('✅ Aplicación inicializada correctamente');
    }

    // Función de utilidad para acceso seguro a propiedades
    safeGet(obj, path, defaultValue = null) {
        try {
            if (!obj || typeof obj !== 'object') {
                return defaultValue;
            }
            
            const keys = path.split('.');
            let result = obj;
            
            for (const key of keys) {
                if (result === null || result === undefined || typeof result !== 'object') {
                    return defaultValue;
                }
                result = result[key];
            }
            
            return result !== undefined && result !== null ? result : defaultValue;
        } catch (error) {
            console.warn(`⚠️ Error en safeGet(${path}):`, error);
            return defaultValue;
        }
    }

    // Función para obtener datos de capítulo de forma segura
    getChapterData(chapterNumber) {
        try {
            // Asegurar que tenemos un número válido
            const chapterNum = parseInt(chapterNumber) || 1;
            
            // Verificar que this.chapters existe y es array
            const chaptersArray = Array.isArray(this.chapters) ? this.chapters : [];
            const chaptersLength = chaptersArray.length;
            
            // Obtener título de forma segura
            let chapterTitle = `Capítulo ${chapterNum}`;
            if (chaptersArray[chapterNum - 1] && chaptersArray[chapterNum - 1].title) {
                chapterTitle = chaptersArray[chapterNum - 1].title;
            }
            
            // Calcular total de capítulos de forma segura
            const totalChapters = Math.max(
                this.totalChapters || 31,
                chaptersLength,
                31 // Mínimo fallback
            );
            
            return {
                exists: chaptersLength > 0 && chapterNum >= 1 && chapterNum <= totalChapters,
                title: chapterTitle,
                totalChapters: totalChapters,
                chaptersLength: chaptersLength
            };
            
        } catch (error) {
            console.error('❌ Error en getChapterData:', error);
            return {
                exists: false,
                title: `Capítulo ${chapterNumber}`,
                totalChapters: 31,
                chaptersLength: 0
            };
        }
    }

    setupEventListeners() {
        console.log('🎮 Configurando event listeners...');
        
        // Los botones de navegación están solo en la barra inferior
        // (La configuración se hace en init() después de cargar el capítulo)

        // Control de tema
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                console.log('🌓 Cambiando tema');
                this.toggleTheme();
            });
        }

        // Control de fuente
        const fontInc = document.getElementById('font-increase');
        const fontDec = document.getElementById('font-decrease');
        
        if (fontInc) {
            fontInc.addEventListener('click', () => {
                console.log('🔤 Aumentando fuente');
                this.adjustFontSize('increase');
            });
        }
        
        if (fontDec) {
            fontDec.addEventListener('click', () => {
                console.log('🔤 Reduciendo fuente');
                this.adjustFontSize('decrease');
            });
        }

        // Toggle sidebar
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarClose = document.getElementById('sidebar-close');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                console.log('📖 Toggle sidebar');
                this.toggleSidebar();
            });
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                console.log('❌ Cerrando sidebar');
                this.closeSidebar();
            });
        }

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && e.ctrlKey) {
                e.preventDefault();
                console.log('⌨️ Atajo: Capítulo anterior');
                this.navigateChapter('prev');
            } else if (e.key === 'ArrowRight' && e.ctrlKey) {
                e.preventDefault();
                console.log('⌨️ Atajo: Capítulo siguiente');
                this.navigateChapter('next');
            } else if (e.key === 'F1') {
                e.preventDefault();
                console.log('⌨️ Atajo: Toggle sidebar');
                this.toggleSidebar();
            }
        });

        // Responsive
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Escuchar cambios de idioma
        document.addEventListener('languageChanged', async (e) => {
            console.log('🌍 Idioma cambiado a:', e.detail.language);
            await this.loadChapterList();
            await this.loadChapter(this.currentChapter);
        });
    }

    async loadChapterList() {
        console.log('📋 Cargando lista de capítulos...');
        
        const chapterList = document.getElementById('chapter-list');
        if (!chapterList) {
            console.error('❌ No se encontró #chapter-list');
            return;
        }

        // Verificar que la estructura esté inicializada
        if (!Array.isArray(this.chapters) || this.chapters.length === 0) {
            console.warn('⚠️ Capítulos no inicializados, reinicializando...');
            try {
                this.initializeChaptersData();
            } catch (error) {
                console.error('❌ Error reinicializando capítulos:', error);
                // Fallback mínimo
                this.chapters = [{ number: 1, title: 'Capítulo 1', file: 'chapter1.md' }];
            }
        }
        
        const chapterData = this.getChapterData(this.currentChapter);
        console.log('📊 Capítulos confirmados:', {
            isArray: Array.isArray(this.chapters),
            length: this.chapters ? this.chapters.length : 0,
            totalChapters: chapterData.totalChapters,
            currentChapter: this.currentChapter
        });

        chapterList.innerHTML = '';

        for (let i = 1; i <= chapterData.totalChapters; i++) {
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
            });

            listItem.appendChild(link);
            chapterList.appendChild(listItem);
        }
        
        console.log('✅ Lista de capítulos cargada');
    }

    async loadChapter(chapterNumber, direction = null) {
        console.log(`📖 Cargando capítulo ${chapterNumber}...`);
        
        if (chapterNumber < 1 || chapterNumber > this.totalChapters) {
            console.error(`❌ Número de capítulo inválido: ${chapterNumber}`);
            this.showError('Capítulo no encontrado');
            return;
        }

        const contentElement = document.getElementById('chapter-content');
        if (!contentElement) {
            console.error('❌ No se encontró #chapter-content');
            return;
        }
        
        // Mostrar loading
        contentElement.style.opacity = '0.5';
        contentElement.innerHTML = `
            <div class="loading">
                <span>Cargando capítulo ${chapterNumber}...</span>
            </div>
        `;

        try {
            console.log(`🔄 === INICIANDO CARGA DEL CAPÍTULO ${chapterNumber} ===`);
            console.log('🔍 Estado inicial:', {
                currentChapter: this.currentChapter,
                chapterNumber: chapterNumber,
                typeof_chapterNumber: typeof chapterNumber,
                BOOK_CONTENT_available: !!window.BOOK_CONTENT
            });
            
            console.log(`📥 Obteniendo contenido del capítulo ${chapterNumber}...`);
            const content = await this.getChapterContent(chapterNumber);
            
            if (content && content.trim()) {
                console.log(`✅ Contenido obtenido: ${content.length} caracteres`);
                
                this.currentChapter = chapterNumber;
                this.displayChapter(content, chapterNumber, direction);
                this.updateNavigation();
                this.updateChapterList();
                this.scrollToTop();
                
                // Actualizar URL
                const url = new URL(window.location);
                url.searchParams.set('chapter', chapterNumber);
                window.history.replaceState({}, '', url);
                
                // Restaurar opacidad
                contentElement.style.opacity = '1';
                
                console.log(`✅ Capítulo ${chapterNumber} cargado exitosamente`);
                
            } else {
                console.warn(`⚠️ Contenido vacío para capítulo ${chapterNumber}`);
                contentElement.style.opacity = '1';
                this.showError('Contenido no disponible');
            }
        } catch (error) {
            console.error(`💥 ERROR CRÍTICO cargando capítulo ${chapterNumber}:`, {
                error: error,
                message: error.message,
                stack: error.stack,
                chapterNumber: chapterNumber,
                currentChapter: this.currentChapter
            });
            contentElement.style.opacity = '1';
            this.showError(`Error crítico al cargar el capítulo ${chapterNumber}: ${error.message}`);
        }
    }

    async getChapterContent(chapterNumber) {
        console.log(`🔍 Buscando contenido para capítulo ${chapterNumber}...`);
        
        // Método 1: Intentar cargar desde servidor HTTP
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            console.log('🌐 Intentando cargar desde servidor HTTP...');
            
            try {
                const url = `${chapterNumber}.md`;
                console.log(`📡 Fetching: ${url}`);
                
                const response = await fetch(url);
                console.log(`📡 Response status: ${response.status}`);
                
                if (response.ok) {
                    const content = await response.text();
                    console.log(`✅ Archivo .md cargado: ${content.length} caracteres`);
                    
                    if (content.trim()) {
                        return content;
                    } else {
                        console.warn(`⚠️ Archivo ${url} está vacío`);
                    }
                } else {
                    console.warn(`⚠️ Error HTTP ${response.status} para ${url}`);
                }
            } catch (error) {
                console.error(`💥 Error fetching ${chapterNumber}.md:`, error);
            }
        } else {
            console.log('📄 Protocolo file://, no se puede usar fetch');
        }

        // Método 2: Usar contenido embebido
        console.log('🗂️ Intentando usar contenido embebido...');
        console.log('🔍 Diagnóstico BOOK_CONTENT:', {
            exists: !!window.BOOK_CONTENT,
            chapters_exists: !!(window.BOOK_CONTENT && window.BOOK_CONTENT.chapters),
            chapter_requested: chapterNumber,
            chapter_type: typeof chapterNumber
        });
        
        if (window.BOOK_CONTENT) {
            console.log('✅ window.BOOK_CONTENT existe');
            if (window.BOOK_CONTENT.chapters) {
                console.log('✅ window.BOOK_CONTENT.chapters existe');
                console.log('📋 Capítulos disponibles:', Object.keys(window.BOOK_CONTENT.chapters));
                
                const chapter = window.BOOK_CONTENT.chapters[chapterNumber];
                if (chapter) {
                    console.log(`✅ Capítulo ${chapterNumber} encontrado:`, {
                        title: chapter.title,
                        contentLength: chapter.content?.length || 0,
                        hasTitle: !!chapter.title,
                        hasContent: !!chapter.content
                    });
                    
                    const fullContent = `# ${chapter.title}\n\n${chapter.content}`;
                    console.log(`📄 Retornando contenido completo: ${fullContent.length} caracteres`);
                    return fullContent;
                } else {
                    console.error(`❌ Capítulo ${chapterNumber} no encontrado en BOOK_CONTENT`);
                    console.log('🔍 Claves disponibles:', Object.keys(window.BOOK_CONTENT.chapters));
                }
            } else {
                console.error('❌ window.BOOK_CONTENT.chapters no existe');
                console.log('🔍 Propiedades de BOOK_CONTENT:', Object.keys(window.BOOK_CONTENT || {}));
            }
        } else {
            console.error('❌ window.BOOK_CONTENT no está disponible');
        }

        // Método 3: Contenido por defecto
        console.log('📝 Usando contenido por defecto...');
        return `${chapterNumber} Capítulo ${chapterNumber}

Este capítulo no está disponible actualmente.

**Estado del sistema:**
- Protocolo: ${window.location.protocol}
- URL: ${window.location.href}
- Contenido embebido: ${window.BOOK_CONTENT ? 'Disponible' : 'No disponible'}

**Para desarrolladores:**
Verifique que el archivo \`${chapterNumber}.md\` exista y tenga contenido.`;
    }

    displayChapter(content, chapterNumber, direction = null) {
        console.log(`🖼️ Mostrando capítulo ${chapterNumber}...`);
        console.log(`📝 Contenido: ${content.substring(0, 100)}...`);
        
        const contentElement = document.getElementById('chapter-content');
        if (!contentElement) {
            console.error('❌ No se encontró #chapter-content');
            return;
        }

        // Verificar si el contenido es muy corto (solo título)
        const lines = content.trim().split('\n').filter(line => line.trim());
        if (lines.length === 1 && lines[0].match(/^\d+\s+/)) {
            console.log('⚠️ Contenido mínimo detectado, agregando información adicional');
            
            const title = lines[0];
            content = `${title}

*Este capítulo está en desarrollo.*

El archivo original (\`${chapterNumber}.md\`) contiene solo el título. 

**Navegación:**
- Use las flechas ◀ ▶ para navegar entre capítulos
- Presione **Ctrl + ←/→** para navegación rápida
- Los **Capítulos 1, 2 y 5** tienen contenido completo

**Estado del capítulo:** ${lines[0]}`;
        }
        
        // Parsear markdown
        const html = this.parseMarkdown(content);
        contentElement.innerHTML = html;
        
        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.closeSidebar();
            }, 100);
        }
        
        console.log(`✅ Capítulo ${chapterNumber} mostrado`);
    }

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

    showError(message) {
        console.error('💥 Mostrando error:', message);
        
        const contentElement = document.getElementById('chapter-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="error">
                    <h2>⚠️ Error</h2>
                    <p>${message}</p>
                    <p><small>Revise la consola del navegador para más detalles.</small></p>
                </div>
            `;
        }
    }

    navigateChapter(direction) {
        console.log(`🧭 ===== NAVEGACIÓN LLAMADA =====`);
        console.log(`🧭 Dirección: ${direction}`);
        console.log(`🧭 Capítulo actual: ${this.currentChapter}`);
        
        const chapterData = this.getChapterData(this.currentChapter);
        console.log(`🧭 Total de capítulos: ${chapterData.totalChapters}`);
        
        let newChapter = this.currentChapter;
        let canNavigate = false;
        
        if (direction === 'prev' && this.currentChapter > 1) {
            newChapter = this.currentChapter - 1;
            canNavigate = true;
            console.log(`✅ Navegación PREV válida: ${this.currentChapter} → ${newChapter}`);
        } else if (direction === 'next' && this.currentChapter < chapterData.totalChapters) {
            newChapter = this.currentChapter + 1;
            canNavigate = true;
            console.log(`✅ Navegación NEXT válida: ${this.currentChapter} → ${newChapter}`);
        } else {
            console.log(`❌ Navegación ${direction} NO válida desde capítulo ${this.currentChapter}`);
        }

        if (canNavigate && newChapter !== this.currentChapter) {
            console.log(`🚀 Ejecutando loadChapter(${newChapter}, "${direction}")`);
            this.loadChapter(newChapter, direction);
        } else {
            console.log(`⚠️ No se ejecutó navegación`);
        }
        console.log(`🧭 ===== FIN NAVEGACIÓN =====`);
    }

    updateNavigation() {
        console.log('🔄 ===== ACTUALIZANDO NAVEGACIÓN =====');
        // Obtener datos de forma segura
        const chapterData = this.getChapterData(this.currentChapter);
        
        console.log('📊 Estado actual:', {
            currentChapter: this.currentChapter,
            totalChapters: chapterData.totalChapters,
            chaptersArrayLength: this.safeGet(this, 'chapters.length', 0),
            chapterTitle: chapterData.title,
            chapterExists: chapterData.exists
        });

        // 1. Actualizar indicador superior (navbar)
        const indicator = document.getElementById('chapter-indicator');
        if (indicator) {
            const newText = `${this.currentChapter} / ${chapterData.totalChapters}`;
            indicator.textContent = newText;
            console.log('✅ Indicador superior actualizado:', newText);
        } else {
            console.error('❌ No se encontró chapter-indicator');
        }

        // 2. Actualizar barra inferior - elementos de navegación
        const bottomPrevBtn = document.getElementById('bottom-prev');
        const bottomNextBtn = document.getElementById('bottom-next');
        const bottomCurrent = document.getElementById('bottom-chapter-current');
        const bottomTotal = document.getElementById('bottom-chapter-total');

        console.log('🔍 Elementos de navegación inferior encontrados:', {
            prevBtn: !!bottomPrevBtn,
            nextBtn: !!bottomNextBtn,
            current: !!bottomCurrent,
            total: !!bottomTotal
        });

        // 3. Actualizar números de capítulo
        if (bottomCurrent) {
            bottomCurrent.textContent = this.currentChapter.toString();
            console.log('✅ Número actual actualizado:', this.currentChapter);
        } else {
            console.error('❌ No se encontró bottom-chapter-current');
        }

        if (bottomTotal) {
            bottomTotal.textContent = chapterData.totalChapters.toString();
            console.log('✅ Total actualizado:', chapterData.totalChapters);
        } else {
            console.error('❌ No se encontró bottom-chapter-total');
        }

        // 4. Actualizar estado de botones con retraso para asegurar que existan
        this.updateButtonStates(bottomPrevBtn, bottomNextBtn);

        // 5. Actualizar sidebar (selección activa)
        this.updateChapterList();
        
        console.log(`✅ ===== NAVEGACIÓN COMPLETADA: ${this.currentChapter}/${this.totalChapters} =====`);
    }

    updateButtonStates(bottomPrevBtn, bottomNextBtn) {
        // Función para actualizar estados
        const updateStates = () => {
            const prevBtn = bottomPrevBtn || document.getElementById('bottom-prev');
            const nextBtn = bottomNextBtn || document.getElementById('bottom-next');
            const chapterData = this.getChapterData(this.currentChapter);

            console.log('🔧 Actualizando estado de botones:', {
                prevFound: !!prevBtn,
                nextFound: !!nextBtn,
                currentChapter: this.currentChapter,
                totalChapters: chapterData.totalChapters
            });

            if (prevBtn) {
                const shouldDisablePrev = this.currentChapter <= 1;
                prevBtn.disabled = shouldDisablePrev;
                prevBtn.title = shouldDisablePrev ? 'No hay capítulo anterior' : `Capítulo ${this.currentChapter - 1}`;
                console.log(`⬅️ Botón anterior: ${shouldDisablePrev ? 'DESHABILITADO' : 'HABILITADO'} (disabled=${prevBtn.disabled})`);
            } else {
                console.error('❌ No se pudo encontrar bottom-prev para actualizar estado');
                return false;
            }

            if (nextBtn) {
                const shouldDisableNext = this.currentChapter >= chapterData.totalChapters;
                nextBtn.disabled = shouldDisableNext;
                nextBtn.title = shouldDisableNext ? 'No hay capítulo siguiente' : `Capítulo ${this.currentChapter + 1}`;
                console.log(`➡️ Botón siguiente: ${shouldDisableNext ? 'DESHABILITADO' : 'HABILITADO'} (disabled=${nextBtn.disabled})`);
            } else {
                console.error('❌ No se pudo encontrar bottom-next para actualizar estado');
                return false;
            }
            
            return true;
        };

        // Intentar actualizar inmediatamente, si falla esperar un poco
        if (!updateStates()) {
            console.log('⏳ Botones no encontrados para actualizar estado, esperando...');
            setTimeout(() => {
                updateStates();
            }, 150);
        }
    }

    updateChapterList() {
        console.log('📋 Actualizando lista de capítulos en sidebar...');
        const links = document.querySelectorAll('#chapter-list a');
        
        console.log('🔍 Enlaces encontrados:', {
            total: links.length,
            currentChapter: this.currentChapter
        });
        
        if (links.length === 0) {
            console.warn('⚠️ No se encontraron enlaces en #chapter-list');
            return;
        }
        
        let activeFound = false;
        links.forEach((link, index) => {
            try {
                link.classList.remove('active');
                const chapterNumber = parseInt(link.dataset.chapter);
                
                if (!isNaN(chapterNumber) && chapterNumber === this.currentChapter) {
                    link.classList.add('active');
                    activeFound = true;
                    console.log(`✅ Marcado como activo: Capítulo ${chapterNumber} (link ${index + 1})`);
                }
            } catch (error) {
                console.warn(`⚠️ Error procesando enlace ${index}:`, error);
            }
        });
        
        if (!activeFound) {
            console.warn('⚠️ No se encontró el enlace activo para el capítulo', this.currentChapter);
        }
        
        console.log('✅ Lista de capítulos actualizada');
    }


    // Resto de métodos simplificados pero funcionales
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }

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

    applyFontSize() {
        document.body.className = document.body.className.replace(/font-size-\w+/g, '');
        if (this.fontSize !== 'normal') {
            document.body.classList.add(`font-size-${this.fontSize}`);
        }
    }

    toggleSidebar() {
        if (window.innerWidth <= 768) {
            this.toggleMobileSidebar();
        } else {
            this.sidebarOpen = !this.sidebarOpen;
            this.updateSidebar();
        }
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const appBody = document.querySelector('.app-body');
        
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
            
            let overlay = document.querySelector('.mobile-overlay');
            if (sidebar.classList.contains('mobile-open')) {
                if (!overlay && appBody) {
                    overlay = document.createElement('div');
                    overlay.className = 'mobile-overlay';
                    appBody.appendChild(overlay);
                    overlay.addEventListener('click', () => this.closeSidebar());
                }
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
        
        const overlay = document.querySelector('.mobile-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        document.body.style.overflow = '';
    }

    updateSidebar() {
        const sidebar = document.getElementById('sidebar');
        const appBody = document.querySelector('.app-body');
        
        if (sidebar && appBody) {
            if (this.sidebarOpen) {
                sidebar.classList.remove('sidebar-collapsed');
                appBody.classList.remove('sidebar-collapsed');
            } else {
                sidebar.classList.add('sidebar-collapsed');
                appBody.classList.add('sidebar-collapsed');
            }
        }
    }

    setupSidebar() {
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        } else {
            this.updateSidebar();
        }
    }

    handleResize() {
        if (window.innerWidth <= 768) {
            this.closeSidebar();
            this.sidebarOpen = true;
        } else {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('mobile-open');
            }
            this.updateSidebar();
            
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) {
                overlay.remove();
            }
            document.body.style.overflow = '';
        }
    }

    scrollToTop() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    getChapterFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const chapter = parseInt(urlParams.get('chapter')) || 1;
        const chapterData = this.getChapterData(chapter);
        
        console.log('🔗 Obteniendo capítulo desde URL:', {
            urlChapter: chapter,
            isValid: chapterData.exists,
            totalChapters: chapterData.totalChapters
        });
        
        return chapter && chapter >= 1 && chapter <= chapterData.totalChapters ? chapter : 1;
    }

    setupBottomNavigation() {
        console.log('🔧 Configurando navegación de la barra inferior...');
        
        // Función para configurar los event listeners
        const configureListeners = () => {
            // Buscar botones
            const bottomPrevBtn = document.getElementById('bottom-prev');
            const bottomNextBtn = document.getElementById('bottom-next');
            
            console.log('🔍 Botones encontrados:', {
                prev: !!bottomPrevBtn,
                next: !!bottomNextBtn
            });
            
            // Configurar botón anterior
            if (bottomPrevBtn) {
                // Remover listeners existentes clonando el elemento
                const newPrevBtn = bottomPrevBtn.cloneNode(true);
                bottomPrevBtn.parentNode.replaceChild(newPrevBtn, bottomPrevBtn);
                
                newPrevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('⬅️ CLIC EN BOTÓN ANTERIOR - Capítulo actual:', this.currentChapter);
                    this.navigateChapter('prev');
                });
                
                console.log('✅ Event listener configurado para botón anterior');
            } else {
                console.error('❌ ERROR: No se encontró el botón bottom-prev');
                return false;
            }
            
            // Configurar botón siguiente
            if (bottomNextBtn) {
                // Remover listeners existentes clonando el elemento
                const newNextBtn = bottomNextBtn.cloneNode(true);
                bottomNextBtn.parentNode.replaceChild(newNextBtn, bottomNextBtn);
                
                newNextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('➡️ CLIC EN BOTÓN SIGUIENTE - Capítulo actual:', this.currentChapter);
                    this.navigateChapter('next');
                });
                
                console.log('✅ Event listener configurado para botón siguiente');
            } else {
                console.error('❌ ERROR: No se encontró el botón bottom-next');
                return false;
            }
            
            return true;
        };

        // Intentar configurar inmediatamente, si falla esperar un poco
        if (!configureListeners()) {
            console.log('⏳ Elementos no encontrados, esperando...');
            setTimeout(() => {
                if (configureListeners()) {
                    console.log('✅ Configuración de navegación inferior completada (con retraso)');
                } else {
                    console.error('❌ ERROR: No se pudieron configurar los botones después del retraso');
                }
            }, 200);
        } else {
            console.log('✅ Configuración de navegación inferior completada');
        }
    }

    initBottomNavigation() {
        console.log('📱 Inicializando barra de navegación inferior...');
        
        const chapterData = this.getChapterData(this.currentChapter);
        
        // Configurar valores iniciales
        const bottomCurrent = document.getElementById('bottom-chapter-current');
        const bottomTotal = document.getElementById('bottom-chapter-total');
        
        if (bottomCurrent) {
            bottomCurrent.textContent = this.currentChapter.toString();
            console.log('✅ Número inicial configurado:', this.currentChapter);
        } else {
            console.error('❌ No se encontró bottom-chapter-current');
        }
        
        if (bottomTotal) {
            bottomTotal.textContent = chapterData.totalChapters.toString();
            console.log('✅ Total inicial configurado:', chapterData.totalChapters);
        } else {
            console.error('❌ No se encontró bottom-chapter-total');
        }
        
        console.log('✅ Barra de navegación inferior inicializada');
    }

    verifyBottomNavigation() {
        console.log('🧪 ===== VERIFICACIÓN DE NAVEGACIÓN =====');
        
        const prevBtn = document.getElementById('bottom-prev');
        const nextBtn = document.getElementById('bottom-next');
        const currentSpan = document.getElementById('bottom-chapter-current');
        const totalSpan = document.getElementById('bottom-chapter-total');
        
        console.log('🔍 Elementos encontrados:', {
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            currentSpan: !!currentSpan,
            totalSpan: !!totalSpan
        });
        
        if (prevBtn) {
            console.log('🔍 Botón anterior:', {
                disabled: prevBtn.disabled,
                textContent: prevBtn.textContent,
                title: prevBtn.title
            });
        }
        
        if (nextBtn) {
            console.log('🔍 Botón siguiente:', {
                disabled: nextBtn.disabled,
                textContent: nextBtn.textContent,
                title: nextBtn.title
            });
        }
        
        if (currentSpan && totalSpan) {
            console.log('🔍 Indicador:', `${currentSpan.textContent}/${totalSpan.textContent}`);
        }
        
        console.log('🧪 ===== FIN VERIFICACIÓN =====');
    }
}

// Instancia global
console.log('📚 Creando instancia global de BookReader...');
window.bookReader = new BookReader();