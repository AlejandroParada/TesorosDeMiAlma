/**
 * TTS - Lectura en voz alta con SpeechSynthesis (nativo del navegador)
 */

window.TTS = {
    speaking: false,
    queue: [],
    _bound: false,

    langLocales: {
        es: 'es-ES',
        en: 'en-US',
        pt: 'pt-BR'
    },

    supported() {
        return typeof window !== 'undefined'
            && 'speechSynthesis' in window
            && typeof SpeechSynthesisUtterance !== 'undefined';
    },

    getVoices() {
        try {
            return speechSynthesis.getVoices() || [];
        } catch (e) {
            return [];
        }
    },

    /** Elige la mejor voz instalada para el idioma de la UI. */
    pickVoice(lang) {
        const voices = this.getVoices();
        if (!voices.length) return null;

        const locale = (this.langLocales[lang] || lang).toLowerCase();
        const prefix = locale.split('-')[0];

        const exact = voices.find(v => (v.lang || '').toLowerCase() === locale);
        if (exact) return exact;

        const byPrefix = voices.find(v => (v.lang || '').toLowerCase().startsWith(prefix));
        if (byPrefix) return byPrefix;

        // Variantes regionales (es-MX, pt-PT, en-GB, etc.)
        return voices.find(v => (v.lang || '').toLowerCase().includes(prefix)) || null;
    },

    getPageText() {
        const el = document.getElementById('chapter-content');
        if (!el) return '';
        const raw = (el.innerText || el.textContent || '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
        return raw;
    },

    /** Parte el texto en trozos cortos (más fiable en Chrome/móvil). */
    chunkText(text, maxLen = 220) {
        const parts = text
            .split(/(?<=[.!?…;:])\s+|\n+/)
            .map(s => s.trim())
            .filter(Boolean);

        const chunks = [];
        let buf = '';

        for (const part of parts) {
            if (!buf) {
                buf = part;
            } else if ((buf + ' ' + part).length <= maxLen) {
                buf += ' ' + part;
            } else {
                chunks.push(buf);
                buf = part;
            }
            while (buf.length > maxLen) {
                chunks.push(buf.slice(0, maxLen));
                buf = buf.slice(maxLen).trim();
            }
        }
        if (buf) chunks.push(buf);
        return chunks;
    },

    stop() {
        this.queue = [];
        this.speaking = false;
        try {
            speechSynthesis.cancel();
        } catch (e) { /* ignore */ }
        this.updateButton();
    },

    toggle(lang) {
        if (!this.supported()) return;
        if (this.speaking) {
            this.stop();
            return;
        }
        this.speak(lang || window.I18N?.lang || 'es');
    },

    speak(lang) {
        if (!this.supported()) return;

        const text = this.getPageText();
        if (!text) return;

        this.stop();

        const locale = this.langLocales[lang] || lang;
        const voice = this.pickVoice(lang);
        this.queue = this.chunkText(text);
        this.speaking = true;
        this.updateButton();

        const speakNext = () => {
            if (!this.speaking || !this.queue.length) {
                this.speaking = false;
                this.queue = [];
                this.updateButton();
                return;
            }

            const utter = new SpeechSynthesisUtterance(this.queue.shift());
            utter.lang = locale;
            if (voice) utter.voice = voice;
            utter.rate = 1;
            utter.pitch = 1;

            utter.onend = () => {
                // Chrome a veces se queda en pausa entre utterances
                if (this.speaking && this.queue.length) {
                    setTimeout(speakNext, 40);
                } else {
                    this.speaking = false;
                    this.updateButton();
                }
            };
            utter.onerror = () => {
                this.speaking = false;
                this.queue = [];
                this.updateButton();
            };

            try {
                speechSynthesis.speak(utter);
            } catch (e) {
                this.speaking = false;
                this.queue = [];
                this.updateButton();
            }
        };

        // Voces a veces cargan de forma asíncrona
        let started = false;
        const start = () => {
            if (started || !this.speaking) return;
            started = true;
            setTimeout(speakNext, 60);
        };

        if (this.getVoices().length === 0) {
            const once = () => {
                speechSynthesis.removeEventListener('voiceschanged', once);
                start();
            };
            speechSynthesis.addEventListener('voiceschanged', once);
            setTimeout(start, 300);
        } else {
            start();
        }
    },

    updateButton() {
        const btn = document.getElementById('tts-toggle');
        if (!btn) return;

        const speaking = this.speaking;
        btn.classList.toggle('speaking', speaking);
        btn.setAttribute('aria-pressed', speaking ? 'true' : 'false');
        btn.textContent = speaking ? '⏹' : '🔊';

        if (window.I18N) {
            const key = speaking ? 'btn.speak.stop' : 'btn.speak';
            btn.title = window.I18N.t(key);
            btn.dataset.i18nTitle = key;
        }
    },

    /**
     * @param {() => string} getLang - función que devuelve el código de idioma actual
     */
    bind(getLang) {
        const btn = document.getElementById('tts-toggle');
        if (!btn || this._bound) return;
        this._bound = true;

        if (!this.supported()) {
            btn.disabled = true;
            btn.title = window.I18N?.t('btn.speak.unsupported') || 'TTS no disponible';
            btn.dataset.i18nTitle = 'btn.speak.unsupported';
            return;
        }

        // Precargar lista de voces
        this.getVoices();
        if (typeof speechSynthesis !== 'undefined') {
            speechSynthesis.addEventListener('voiceschanged', () => this.getVoices());
        }

        btn.addEventListener('click', () => {
            const lang = typeof getLang === 'function'
                ? getLang()
                : (window.I18N?.lang || 'es');
            this.toggle(lang);
        });

        this.updateButton();
    }
};
