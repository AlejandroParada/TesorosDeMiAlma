/**
 * i18n - UI strings y cambio de idioma (es / en / pt)
 */

window.I18N = {
    languages: ['es', 'en', 'pt'],
    labels: { es: 'ES', en: 'EN', pt: 'PT' },
    names: { es: 'Español', en: 'English', pt: 'Português' },

    strings: {
        es: {
            'site.title': 'Tesoros de Mi Alma',
            'sidebar.chapters': 'Capítulos',
            'chapter.label': 'Capítulo',
            'cover': 'Portada',
            'dedication': 'Dedicatoria',
            'introduction': 'Introducción',
            'loading': 'Cargando...',
            'error': 'Error',
            'content.unavailable': 'Contenido no disponible.',
            'content.missing': 'Este capítulo aún no está traducido a este idioma.',
            'footer.copyright': '© 2024 Tesoros de Mi Alma. Todos los derechos reservados.',
            'btn.theme': 'Tema',
            'btn.lang': 'Idioma',
            'btn.font.dec': 'Reducir fuente',
            'btn.font.inc': 'Ampliar fuente',
            'fullscreen.start': 'Toca para comenzar',
            'glossary.title': 'Glosario',
            'glossary.notfound': 'Término no encontrado',
            'glossary.error': 'Error al cargar el glosario'
        },
        en: {
            'site.title': 'Treasures of My Soul',
            'sidebar.chapters': 'Chapters',
            'chapter.label': 'Chapter',
            'cover': 'Cover',
            'dedication': 'Dedication',
            'introduction': 'Introduction',
            'loading': 'Loading...',
            'error': 'Error',
            'content.unavailable': 'Content not available.',
            'content.missing': 'This chapter is not yet translated into this language.',
            'footer.copyright': '© 2024 Treasures of My Soul. All rights reserved.',
            'btn.theme': 'Theme',
            'btn.lang': 'Language',
            'btn.font.dec': 'Decrease font',
            'btn.font.inc': 'Increase font',
            'fullscreen.start': 'Tap to start',
            'glossary.title': 'Glossary',
            'glossary.notfound': 'Term not found',
            'glossary.error': 'Error loading glossary'
        },
        pt: {
            'site.title': 'Tesouros da Minha Alma',
            'sidebar.chapters': 'Capítulos',
            'chapter.label': 'Capítulo',
            'cover': 'Capa',
            'dedication': 'Dedicatória',
            'introduction': 'Introdução',
            'loading': 'Carregando...',
            'error': 'Erro',
            'content.unavailable': 'Conteúdo não disponível.',
            'content.missing': 'Este capítulo ainda não está traduzido para este idioma.',
            'footer.copyright': '© 2024 Tesouros da Minha Alma. Todos os direitos reservados.',
            'btn.theme': 'Tema',
            'btn.lang': 'Idioma',
            'btn.font.dec': 'Diminuir fonte',
            'btn.font.inc': 'Aumentar fonte',
            'fullscreen.start': 'Toque para começar',
            'glossary.title': 'Glossário',
            'glossary.notfound': 'Termo não encontrado',
            'glossary.error': 'Erro ao carregar glossário'
        }
    },

    get lang() {
        return localStorage.getItem('lang') || 'es';
    },

    set lang(code) {
        if (!this.languages.includes(code)) return;
        localStorage.setItem('lang', code);
        document.documentElement.lang = code;
    },

    t(key) {
        return this.strings[this.lang]?.[key]
            || this.strings.es[key]
            || key;
    },

    apply() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = this.t(el.dataset.i18nTitle);
        });
        const btn = document.getElementById('lang-toggle');
        if (btn) btn.textContent = this.labels[this.lang] || 'ES';
        document.title = this.t('site.title');
    }
};
