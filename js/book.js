/**
 * Sistema principal del libro
 * Maneja la carga de capítulos, navegación y configuraciones
 */

class BookReader {
    constructor() {
        this.currentChapter = 0; // Empezar con la introducción
        this.totalChapters = 31; // Actualizar según el número de archivos
        this.hasIntroduction = true; // Flag para indicar que hay introducción
        this.chapters = {};
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.theme = localStorage.getItem('theme') || 'light';
        this.sidebarOpen = window.innerWidth > 768;
        
        // Contenido embebido para funcionamiento sin servidor
        this.initEmbeddedContent();
        
        this.init();
    }

    /**
     * Inicializar contenido embebido para modo local
     */
    initEmbeddedContent() {
        this.embeddedChapters = {
            'es': {},
            'en': {},
            'pt': {}
        };
        
        // Cargar contenido dinámicamente desde los archivos .md existentes
        this.loadEmbeddedChapters();
    }

    /**
     * Cargar capítulos embebidos
     */
    async loadEmbeddedChapters() {
        // Por ahora, vamos a incluir algunos capítulos básicos
        this.embeddedChapters.es[1] = `1 Aprendí a andar en bicicleta

"He aqui, mi Espíritu reposa sobre ti... anda conmigo" (Moises 6:34)

Cuando era chico los niños de la cuadra andaban en bicicleta por la vereda por seguridad, la calle era peligrosa. Yo no sabía andar en bicicleta y no tenía bici, entonces solo miraba como los demás se divertían con sus bicicletas, un vecino padre de uno de los niños que andaba en bicicleta que había venido de trabajar, prestó atención y me preguntó porque no me unía a los demás niños para jugar con ellos. Yo le respondí con verguenza, es que no se andar en bicleta, ah pero no te preocupes yo te voy a enseñar a andar me dijo.

Al otro dia dijo nos vamos para el Prado que nos quedaba a 4 cuadras, vengan con nosotros (su familia) y la biciletas que ellos tenían, y fuimos mi hermano y yo con ellos. En el "Hotel del Prado", en ese entonces un restoran que a penas estaba mantenido tenía una antigua pista de baile al exterior que no usaban que sería perfecta para "aprender a andar en bicicleta".

Sergio este buen vecino, me dijo "veni subite", ajusto la altura del asiento y me dio las indicaciones de como pedalear y mover el manubrio o volante para que "funcione" la bicicleta. Me dijo aparte y al oido como susurrando "Alejandro no te preocupes vos podés, vos podés, lo vas a lograr!!!", el empezó a correr al lado mío, al principio sosteniendo el manubrio, y empujandome desde el asiento de la bici. En un momento me dijo "mové los pies vamos vamos vamos" y yo me animé a pedalear, y "bien bien bien!!!!" decía, al rato me dijo "vos podes controlar la bici te suelto el volante ahora" y podía mover el volante, realmente contralaba la bicicleta. "vamos vamos vamos!!!! vos podes!!!". Aun seguía corriendo conmigo, empujando el asiento, "fuerza, fuerza, fuerza!!!!" y sentía su aliento y ánimo intenso, pero sentia su vos cada vez mas lejana y mi hermano que lo vi serca estaba asombrado, dijo "ya sabés andar en bicleta!!!!". Y yo dije "QUEEEE???!!!", mire pare el costado y no esta Sergio, iba rápido, pero lo que aun no sabía era como frenar!!! no me lo había explicado!!! Y al mirar para atrás y vi que no estaba Sergio, no preste atención y me di contra un arbol, menos mal que no iba muy rápido, y lleve algunos rasguñones, "vamos vamos arriba que no fue nada" me decia Segio con su ánimo. Justo te estaba por explicar como funcionaban los frenos. Justo esa bicicleta era muy facil de frena porque tenía 3 trenos, el de adelante, el de atrás y también tenia freno "contrapedal" (si uno pedalea al revés la bici frena). Bueno aprendi muy bien que pasa sino freno, de una manera muy practica y memorable. Volvimos andando de bici luego de hermosa experiencia y del esfuerzo del padre de esta amigo vicino.

La vida tiene sus vueltas, y pasaron alguños años y luego todo fuimos creciendo, y un día me enteré de que a Sergio le había dado un ACV en el trabajo. Que triste noticia, pero pudo salir adelante y al poco tiempo le dieron el alta y lo mandaron para la casa. Habia perdido la mobilidad del lado izquierdo del cuerpo, me entere que le habían puesto o adaptado unas roldanas y cuerdas para que puediera hacer ejercicios de reabilitación de fisioterapia, que debería hacerlo cada día. Sus hijos estudiaban, trabajaban y no había tiempo para ayudar a Sergio con los ejercicio, su esposa cocinaba y entre tiempo ayudaba a Sergio con los ejercicios. Un dia me di cuenta y me dije "esta mujer no da mas, con todo yo tengo que hacer algo", entonce me acerque, y le dije "¿Te puedo ayudar con Sergio?" Su cara se iluminó "¿en serio?" dijo, "tengo algo de tiempo antes de entrar al Liceo" le respondi.

Fui a ver a Sergio, ahi estaba, como "apagado" y parecía "otro", lo salude y creo que no me reconoció, la personas cambian "los chicos crecen, es el hijo de Teresa, ¿te acordas de él?" le dijo su esposa, el tenía la mirada perdida y casi no hablaba. Yo le dije "no te precupes aca estoy para ayudarte" le coloque la mano y brazo que no movía en un arnes y con la otra debía hacer fuerza para levantarla, era un ejercio simple pero para su condición era muy difícil. Empece a hacer los ejercicios con él cada uno y lo animaba, en un momento me acerque a su oido como susurrando y le dije "Sergio no te preocupes vos podés, vos podés, lo vas a lograr!!!", en ese momento tus ojos cobraron ánimo como si se iluminaran, y luego broto una lágrima de su ojo, el recordo ese momento mágico en el Prado, pero esta vez era él el receptor de la dádiva que una vez me había dado. Con Sergio hicimos los ejercicio hasta que no tuve mas tiempo para pasar con el, el había recuperado parte de la movilidad.

Esta experiencia me enseño que cuando damos amor, este retorma multiplicado`;

        this.embeddedChapters.es[2] = `2 La fe de una niña

Habia una niña por los años 50s que era muy activa y enérgica con 4 años, sus padres de formación Católica, mecionaban a Dios por rutina, o por tradición. Sus padres tenían un almacen y no encontraban formas de entretenerla, entonces le consiguieron un cochorrito como mascota, era muy jugeton con la dueña y con mucha energía. Por las mañana su cachorrito iba y despertaba a su pequeña dueña con ladridos, y resongos.  La niña se daba cuenta de muchas cosas, y le resaba a la "virgencita" porque lo había visto de su devotos padres que le hablan de Dios, y ella sabía que lo más importante era Dios y hablar con Dios, aunque no entendiera los conceptos como los grandes.

Hubo una ocasion, en la tarde y por un descuido, se le escapo el cachorrito a su lado y se fue para la calle, y justo pasaba un camión..... le paso por arriba, todo quedaron paralizados sus padres, fueron a recoger lo que quedaba del cachorrito (literalmente aplastado) y lo pusieron en una caja y sus padres le decian para consolar a la niña que capaz iba a estar bien para el dia siguiente, aunque no querían añadir mas tristesa a la situación por la realidad que era evidente. Y la dejaron en un costado y todo se fueron a acostar porque era de noche. La niña se puso a orar y decia: "Dicito, Docito, si yo sé que tu vives, y que estas ahí, por favor cura a ese cachorrito, por favor cúralo!!!"

A la mañana siguiente, y ante la mirada de sus padres, porque no se podia creer, porque no podían dar crédito a sus oido y ojos, aparece muy campante el cachorrito que iba a despertar a su pequeña dueña con ladridos, y resongos. No saben la alegría que le dio a la dueña que marco y definio su fe para toda la vida. Más de 70 años después, si mi madre contó su testimonio para sus hijos y nietos de como la fe de una niña puede dar esperanza y producir milagros.`;

        this.embeddedChapters.es[3] = `3 De pie al lado de mi cama`;

        // Agregar más capítulos básicos
        for (let i = 4; i <= 31; i++) {
            this.embeddedChapters.es[i] = `${i} Capítulo ${i}

Este capítulo aún no está disponible en modo local. 

Para ver todo el contenido, por favor:
1. Instala Python desde python.org/downloads
2. Ejecuta: python server.py
3. O abre los archivos .md individuales

El contenido completo está disponible en los archivos ${i}.md del proyecto.`;
        }
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
        await this.loadChapter(1);
        this.updateNavigation();
    }

    /**
     * Configurar todos los event listeners
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

        // Responsive - cerrar sidebar en móvil al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebar-toggle');
                
                if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
                    this.closeSidebar();
                }
            }
        });

        // Responsive - actualizar sidebar en resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Escuchar cambios de idioma
        document.addEventListener('languageChanged', (e) => {
            this.handleLanguageChange(e.detail.language);
        });
    }

    /**
     * Cargar lista de capítulos
     */
    async loadChapterList() {
        const chapterList = document.getElementById('chapter-list');
        chapterList.innerHTML = '';

        // Añadir introducción si existe
        if (this.hasIntroduction) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.dataset.chapter = 0;
            link.textContent = window.i18n.t('introduction') || 'Introducción';
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadChapter(0);
            });

            listItem.appendChild(link);
            chapterList.appendChild(listItem);
        }

        for (let i = 1; i <= this.totalChapters; i++) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.dataset.chapter = i;
            link.textContent = `${window.i18n.t('chapter.number')} ${i}`;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadChapter(i);
            });

            listItem.appendChild(link);
            chapterList.appendChild(listItem);
        }
    }

    /**
     * Cargar un capítulo específico
     */
    async loadChapter(chapterNumber) {
        // Permitir capítulo 0 para introducción
        const minChapter = this.hasIntroduction ? 0 : 1;
        if (chapterNumber < minChapter || chapterNumber > this.totalChapters) {
            this.showError(window.i18n.t('error.chapterNotFound'));
            return;
        }

        const contentElement = document.getElementById('chapter-content');
        contentElement.innerHTML = `<div class="loading" data-i18n="loading">${window.i18n.t('loading')}</div>`;

        try {
            // Intentar cargar en el idioma actual primero
            let content = await this.fetchChapterContent(chapterNumber);
            
            if (content) {
                this.currentChapter = chapterNumber;
                this.displayChapter(content, chapterNumber);
                this.updateNavigation();
                this.updateChapterList();
                this.scrollToTop();
                
                // Actualizar URL sin recargar la página
                const url = new URL(window.location);
                url.searchParams.set('chapter', chapterNumber);
                window.history.replaceState({}, '', url);
            } else {
                this.showError(window.i18n.t('error.loadChapter'));
            }
        } catch (error) {
            console.error('Error loading chapter:', error);
            this.showError(window.i18n.t('error.loadChapter'));
        }
    }

    /**
     * Obtener el contenido de un capítulo
     */
    async fetchChapterContent(chapterNumber) {
        const language = window.i18n.getLanguage();
        
        // Manejar introducción especial
        if (chapterNumber === 0) {
            const fileName = 'introduccion.md';
            
            if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
                // Intentar cargar desde content/[lang]/
                try {
                    const response = await fetch(`content/${language}/${fileName}`);
                    if (response.ok) {
                        return await response.text();
                    }
                } catch (error) {
                    console.log(`Introduction not found in ${language}, trying original file`);
                }

                // Si no existe traducción, intentar cargar el archivo original
                try {
                    const response = await fetch(fileName);
                    if (response.ok) {
                        return await response.text();
                    }
                } catch (error) {
                    console.error('Error fetching introduction:', error);
                }
                
                return null;
            } else {
                // Modo local: contenido embebido de introducción
                return this.getEmbeddedIntroduction(language);
            }
        }
        
        // Si estamos en un servidor (protocolo http/https), usar fetch
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            // Intentar cargar desde content/[lang]/
            try {
                const response = await fetch(`content/${language}/${chapterNumber}.md`);
                if (response.ok) {
                    return await response.text();
                }
            } catch (error) {
                console.log(`Chapter ${chapterNumber} not found in ${language}, trying original files`);
            }

            // Si no existe traducción, intentar cargar el archivo original
            try {
                const response = await fetch(`${chapterNumber}.md`);
                if (response.ok) {
                    return await response.text();
                }
            } catch (error) {
                console.error('Error fetching chapter:', error);
            }
            
            return null;
        } else {
            // Modo local (file://): cargar contenido embebido
            return this.getEmbeddedContent(chapterNumber, language);
        }
    }

    /**
     * Obtener contenido embebido de la introducción
     */
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

    /**
     * Obtener contenido embebido para modo local
     */
    getEmbeddedContent(chapterNumber, language) {
        // Usar los datos del archivo content-data.js
        if (window.BOOK_CONTENT && window.BOOK_CONTENT.chapters[chapterNumber]) {
            const chapter = window.BOOK_CONTENT.chapters[chapterNumber];
            return `${chapterNumber} ${chapter.title}\n\n${chapter.content}`;
        }
        
        return `${chapterNumber} Capítulo no disponible

Este capítulo no está disponible en modo local.

Para ver el contenido completo, instala Python y ejecuta el servidor:
1. python.org/downloads
2. python server.py`;
    }

    /**
     * Mostrar el contenido del capítulo
     */
    displayChapter(content, chapterNumber) {
        const contentElement = document.getElementById('chapter-content');
        
        // Parsear el contenido markdown básico
        const html = this.parseMarkdown(content);
        
        contentElement.innerHTML = `
            <h1>${window.i18n.t('chapter.number')} ${chapterNumber}</h1>
            ${html}
        `;
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
            // Citas
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
        const minChapter = this.hasIntroduction ? 0 : 1;
        
        if (direction === 'prev' && this.currentChapter > minChapter) {
            newChapter = this.currentChapter - 1;
        } else if (direction === 'next' && this.currentChapter < this.totalChapters) {
            newChapter = this.currentChapter + 1;
        }

        if (newChapter !== this.currentChapter) {
            this.loadChapter(newChapter);
        }
    }

    /**
     * Actualizar navegación
     */
    updateNavigation() {
        const prevBtn = document.getElementById('prev-chapter');
        const nextBtn = document.getElementById('next-chapter');
        const indicator = document.getElementById('chapter-indicator');
        const minChapter = this.hasIntroduction ? 0 : 1;

        if (prevBtn) {
            prevBtn.disabled = this.currentChapter <= minChapter;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentChapter >= this.totalChapters;
        }

        if (indicator) {
            if (this.currentChapter === 0) {
                indicator.textContent = window.i18n.t('introduction') || 'Introducción';
            } else {
                indicator.textContent = `${this.currentChapter} / ${this.totalChapters}`;
            }
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
            themeToggle.title = window.i18n.t(this.theme === 'light' ? 'theme.dark' : 'theme.light');
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
        sidebar.classList.toggle('mobile-open');
        
        // Crear/remover overlay
        let overlay = document.querySelector('.mobile-overlay');
        if (sidebar.classList.contains('mobile-open')) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'mobile-overlay';
                document.body.appendChild(overlay);
            }
            overlay.classList.add('active');
            overlay.addEventListener('click', () => this.closeSidebar());
        } else if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Cerrar sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('mobile-open');
        
        const overlay = document.querySelector('.mobile-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    /**
     * Actualizar sidebar para desktop
     */
    updateSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (this.sidebarOpen) {
            sidebar.classList.remove('sidebar-collapsed');
        } else {
            sidebar.classList.add('sidebar-collapsed');
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
            this.closeSidebar();
        } else {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('mobile-open');
            this.updateSidebar();
            
            // Remover overlay si existe
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }

    /**
     * Manejar cambio de idioma
     */
    async handleLanguageChange(language) {
        await this.loadChapterList();
        await this.loadChapter(this.currentChapter);
        this.applyTheme(); // Para actualizar tooltips
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