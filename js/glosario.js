/**
 * Sistema de Glosario - Panel lateral derecho
 * Maneja la apertura y cierre del panel de glosario con definiciones
 */

class GlosarioManager {
    constructor() {
        this.isOpen = false;
        this.currentTerm = null;
        this.glossaryTerms = [
            'primaria', 'misión', 'mision', 'sociedad de socorro', 'templo', 'obispo', 'barrio',
            'elderes', 'élderes', 'hermanas misioneras', 'hermana misionera', 'diezmo', 'miembro',
            'leer las escrituras', 'escrituras', 'oración', 'libro de mormón', 'el libro de mormón', 'otro lado',
            'evangelio de jesucristo', 'el evangelio de jesucristo', 'evangelio', 'testimonio', 'ministrar',
            'bendición', 'bendicion', 'sacerdocio', 'presidente de misión', 'presidente de mision', 'revelación', 'revelacion', 'espíritu santo', 'espiritu santo', 'estaca', 'cristo', 'jesucristo', 'caridad',
            'primary', 'mission', 'relief society', 'temple', 'bishop', 'ward',
            'elders', 'sister missionaries', 'sister missionary', 'tithing', 'member',
            'scripture study', 'scriptures', 'prayer', 'book of mormon', 'the book of mormon', 'other side',
            'gospel of jesus christ', 'the gospel of jesus christ', 'gospel', 'testimony', 'ministering', 'minister',
            'blessing', 'priesthood', 'mission president', 'revelation', 'holy spirit', 'holy ghost', 'stake', 'christ', 'jesus christ', 'charity',
            'primária', 'missão', 'bispo', 'ala',
            'irmãs missionárias', 'irmã missionária', 'dízimo', 'sister', 'sisters', 'membro',
            'estudo das escrituras', 'escrituras', 'oração', 'livro de mórmon', 'o livro de mórmon', 'outro lado',
            'evangelho de jesus cristo', 'o evangelho de jesus cristo', 'evangelho', 'testemunho', 'ministrar',
            'bênção', 'sacerdócio', 'presidente de missão', 'revelação', 'espírito santo', 'estaca', 'cristo', 'jesus cristo', 'caridade'
        ];
        
        this.init();
    }

    init() {
        this.createGlossaryPanel();
        this.processTextLinks();
        this.setupEventListeners();
    }

    createGlossaryPanel() {
        // Crear el panel de glosario
        const panel = document.createElement('div');
        panel.id = 'glossary-panel';
        panel.className = 'glossary-panel';
        panel.innerHTML = `
            <div class="glossary-header">
                <h3 id="glossary-title" data-i18n="glossary.title">Glosario</h3>
                <button id="glossary-close" class="control-btn">✕</button>
            </div>
            <div class="glossary-content" id="glossary-content">
                <div class="loading" data-i18n="loading">Cargando...</div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    processTextLinks() {
        // Buscar y convertir palabras del glosario en enlaces
        const chapterContent = document.getElementById('chapter-content');
        if (!chapterContent) return;

        let html = chapterContent.innerHTML;
        
        // Crear un mapa de términos normalizados
        const termMap = {
            'primaria': 'primaria',
            'primary': 'primaria',
            'primária': 'primaria',
            'misión': 'mision',
            'mission': 'mision',
            'missão': 'mision',
            'sociedad de socorro': 'sociedad-de-socorro',
            'relief society': 'sociedad-de-socorro',
            'templo': 'templo',
            'temple': 'templo',
            'obispo': 'obispo',
            'bishop': 'obispo',
            'bispo': 'obispo',
            'barrio': 'barrio',
            'ward': 'barrio',
            'ala': 'barrio',
            'elderes': 'elderes',
            'élderes': 'elderes',
            'elders': 'elderes',
            'hermanas misioneras': 'hermanas-misioneras',
            'hermana misionera': 'hermanas-misioneras',
            'sister missionaries': 'hermanas-misioneras',
            'sister missionary': 'hermanas-misioneras',
            'irmãs missionárias': 'hermanas-misioneras',
            'irmã missionária': 'hermanas-misioneras',
            'sister': 'hermanas-misioneras',
            'sisters': 'hermanas-misioneras',
            'diezmo': 'diezmo',
            'tithing': 'diezmo',
            'dízimo': 'diezmo',
            'miembro': 'miembro',
            'member': 'miembro',
            'membro': 'miembro',
            'leer las escrituras': 'leer-las-escrituras',
            'escrituras': 'leer-las-escrituras',
            'scripture study': 'leer-las-escrituras',
            'scriptures': 'leer-las-escrituras',
            'estudo das escrituras': 'leer-las-escrituras',
            'oración': 'oracion',
            'prayer': 'oracion',
            'oração': 'oracion',
            'libro de mormón': 'libro-de-mormon',
            'el libro de mormón': 'libro-de-mormon',
            'book of mormon': 'libro-de-mormon',
            'the book of mormon': 'libro-de-mormon',
            'livro de mórmon': 'libro-de-mormon',
            'o livro de mórmon': 'libro-de-mormon',
            'otro lado': 'otro-lado',
            'other side': 'otro-lado',
            'outro lado': 'otro-lado',
            'evangelio de jesucristo': 'evangelio-de-jesucristo',
            'el evangelio de jesucristo': 'evangelio-de-jesucristo',
            'evangelio': 'evangelio-de-jesucristo',
            'gospel of jesus christ': 'evangelio-de-jesucristo',
            'the gospel of jesus christ': 'evangelio-de-jesucristo',
            'gospel': 'evangelio-de-jesucristo',
            'evangelho de jesus cristo': 'evangelio-de-jesucristo',
            'o evangelho de jesus cristo': 'evangelio-de-jesucristo',
            'evangelho': 'evangelio-de-jesucristo',
            'testimonio': 'testimonio',
            'testimony': 'testimonio',
            'testemunho': 'testimonio',
            'ministrar': 'ministrar',
            'ministering': 'ministrar',
            'minister': 'ministrar',
            'bendición': 'bendicion',
            'bendicion': 'bendicion',
            'blessing': 'bendicion',
            'bênção': 'bendicion',
            'sacerdocio': 'sacerdocio',
            'priesthood': 'sacerdocio',
            'sacerdócio': 'sacerdocio',
            'presidente de misión': 'presidente-de-mision',
            'presidente de mision': 'presidente-de-mision',
            'mission president': 'presidente-de-mision',
            'presidente de missão': 'presidente-de-mision',
            'revelación': 'revelacion',
            'revelacion': 'revelacion',
            'revelation': 'revelacion',
            'revelação': 'revelacion',
            'espíritu santo': 'espiritu-santo',
            'espiritu santo': 'espiritu-santo',
            'holy spirit': 'espiritu-santo',
            'holy ghost': 'espiritu-santo',
            'espírito santo': 'espiritu-santo',
            'estaca': 'estaca',
            'stake': 'estaca',
            'cristo': 'cristo',
            'jesucristo': 'cristo',
            'christ': 'cristo',
            'jesus christ': 'cristo',
            'jesus cristo': 'cristo',
            'caridad': 'caridad',
            'charity': 'caridad',
            'caridade': 'caridad'
        };

        // Procesar términos largos primero (evitar parciales:
        // "Jesucristo" / "Jesus Christ" antes que "Cristo" / "Christ")
        const terms = Object.keys(termMap).sort((a, b) => b.length - a.length);
        for (const term of terms) {
            const filename = termMap[term];
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?<![\\wáéíóúüñÁÉÍÓÚÜÑ])${escaped}(?![\\wáéíóúüñÁÉÍÓÚÜÑ])`, 'gi');
            html = html.replace(regex, (match, offset, full) => {
                // No enlazar si ya estamos dentro de un glossary-link
                // (evita que "cristo" reaparezca dentro de "Jesucristo" ya enlazado)
                const before = full.slice(0, offset);
                const openIdx = before.lastIndexOf('<span class="glossary-link"');
                const closeIdx = before.lastIndexOf('</span>');
                if (openIdx > closeIdx) return match;

                // No enlazar dentro de atributos/etiquetas HTML
                const lastLt = before.lastIndexOf('<');
                const lastGt = before.lastIndexOf('>');
                if (lastLt > lastGt) return match;

                return `<span class="glossary-link" data-term="${filename}">${match}</span>`;
            });
        }
        
        chapterContent.innerHTML = html;
    }

    setupEventListeners() {
        // Cerrar panel
        document.addEventListener('click', (e) => {
            if (e.target.id === 'glossary-close') {
                this.closePanel();
            }
        });

        // Abrir panel al hacer clic en términos
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('glossary-link')) {
                const term = e.target.getAttribute('data-term');
                this.openPanel(term);
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });

        // Cerrar al hacer clic fuera del panel
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('glossary-panel');
            if (this.isOpen && !panel.contains(e.target) && !e.target.classList.contains('glossary-link')) {
                this.closePanel();
            }
        });
    }

    async openPanel(term) {
        this.currentTerm = term;
        this.isOpen = true;
        
        const panel = document.getElementById('glossary-panel');
        const content = document.getElementById('glossary-content');
        const title = document.getElementById('glossary-title');
        
        // Mostrar el panel
        panel.classList.add('open');
        document.body.classList.add('glossary-open');
        
        // Mostrar loading
        content.innerHTML = '<div class="loading" data-i18n="loading">Cargando...</div>';
        
        try {
            // Obtener idioma actual
            const currentLang = window.I18N ? window.I18N.lang : 'es';
            
            // Cargar contenido del glosario
            const response = await fetch(`content/${currentLang}/glosario/${term}.md`);
            
            if (response.ok) {
                const markdown = await response.text();
                const html = this.markdownToHTML(markdown);
                content.innerHTML = html;
                
                // Actualizar título
                const titleMatch = markdown.match(/^#\s+(.+)$/m);
                if (titleMatch) {
                    title.textContent = titleMatch[1];
                }
            } else {
                const notFoundText = window.I18N ? window.I18N.t('glossary.notfound') : 'Término no encontrado';
                content.innerHTML = `
                    <div class="error">
                        <h4>${notFoundText}</h4>
                        <p>No se pudo cargar la definición para "${term}".</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading glossary term:', error);
            const errorText = window.I18N ? window.I18N.t('glossary.error') : 'Error al cargar el glosario';
            content.innerHTML = `
                <div class="error">
                    <h4>${window.I18N ? window.I18N.t('error') : 'Error'}</h4>
                    <p>${errorText}</p>
                </div>
            `;
        }
        
        // Aplicar traducciones si están disponibles
        if (window.I18N) {
            window.I18N.apply();
        }
    }

    closePanel() {
        this.isOpen = false;
        this.currentTerm = null;
        
        const panel = document.getElementById('glossary-panel');
        panel.classList.remove('open');
        document.body.classList.remove('glossary-open');
    }

    markdownToHTML(markdown) {
        let html = markdown
            // Headers
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Lists
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            // Wrap lists
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            // Fix nested lists
            .replace(/<\/ul>\s*<ul>/g, '')
            // Paragraphs
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (!paragraph) return '';
                if (paragraph.startsWith('<h') || 
                    paragraph.startsWith('<ul') || 
                    paragraph.startsWith('<li')) {
                    return paragraph;
                }
                return `<p>${paragraph}</p>`;
            })
            .join('\n');
        
        return html;
    }

    // Método para refrescar enlaces cuando cambie el contenido
    refresh() {
        this.processTextLinks();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.glossaryManager = new GlosarioManager();
    // Por si el capítulo ya cargó antes del glosario
    setTimeout(() => window.glossaryManager?.refresh(), 300);
});