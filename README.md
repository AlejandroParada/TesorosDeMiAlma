# 📖 Tesoros de Mi Alma

Un libro digital responsive con soporte multilingüe (español, inglés, portugués), modo oscuro, control de fuente y navegación intuitiva.

## ✨ Características

- 📱 **Diseño Responsive**: Se adapta perfectamente a móviles, tabletas y escritorio
- 🌓 **Modo Oscuro/Claro**: Cambia entre temas con un clic
- 🔤 **Control de Fuente**: Ajusta el tamaño de la fuente (A+ / A-)
- 🌍 **Multilingüe**: Soporte para Español, Inglés y Portugués
- ⌨️ **Atajos de Teclado**: Navegación rápida con teclado
- 🎯 **Sin Dependencias**: Funciona con HTML, CSS y JavaScript puro
- 🚀 **Servidor Local**: Incluye servidor web simple en Python

## 🚀 Inicio Rápido

### Opción 1: Servidor Simple
```bash
python start.py
```

### Opción 2: Servidor Completo
```bash
python server.py
```

### Opción 3: Sin Python
Abre directamente `index.html` en tu navegador (algunas funciones pueden estar limitadas por CORS).

## 🌐 Publicar en GitHub Pages

El proyecto es estático (HTML/CSS/JS) y está preparado para GitHub Pages:

### Requisitos ya incluidos
- `.nojekyll` — evita que Jekyll procese los `.md` (necesarios para `fetch`)
- Rutas con **base path** automático (funciona en `/nombre-del-repo/`)
- `404.html` — redirige a la app si la URL no existe
- Workflow `.github/workflows/pages.yml` — despliegue automático

### Activar Pages (una vez)
1. Sube el repo a GitHub
2. Ve a **Settings → Pages**
3. En **Source**, elige **GitHub Actions**
4. Haz push a `main` (o ejecuta el workflow manualmente)
5. La URL será: `https://TU-USUARIO.github.io/TesorosDeMiAlma/`

### Alternativa sin Actions
En **Settings → Pages → Source**, elige la rama `main` y carpeta `/ (root)`.

### Nota
Los capítulos se cargan desde `content/{es,en,pt}/*.md` (fuente única; sin duplicados en la raíz). Con `.nojekyll` GitHub Pages los sirve como archivos estáticos.

## 🎮 Controles y Atajos

### Navegación
- **Ctrl + ←**: Capítulo anterior
- **Ctrl + →**: Capítulo siguiente
- **F1**: Mostrar/ocultar menú lateral
- **Esc**: Cerrar menú lateral (en móvil)

### Interfaz
- **🌙/☀️**: Cambiar entre modo oscuro y claro
- **A+/A-**: Aumentar/disminuir tamaño de fuente
- **🌍**: Selector de idioma (ES/EN/PT)

## 📁 Estructura del Proyecto

```
TesorosDeMiAlma/
├── index.html              # Página principal
├── server.py              # Servidor web
├── styles/
│   └── simple.css         # Estilos
├── js/
│   ├── book-clean.js      # Lógica del libro (activo)
│   ├── i18n.js            # Internacionalización
│   ├── glosario.js        # Glosario
│   └── content-data.js    # Fallback offline
├── content/               # Contenido canónico (DRY)
│   ├── es/               # Español (idioma base)
│   ├── en/               # English
│   └── pt/               # Português
└── assets/               # Recursos (imágenes, iconos)
```

## 🌍 Soporte Multilingüe

### Idiomas Disponibles
- **🇪🇸 Español** (es) - Idioma base
- **🇺🇸 English** (en) - Inglés
- **🇧🇷 Português** (pt) - Portugués

### Añadir Nuevos Idiomas

1. Crea una carpeta en `content/[codigo-idioma]/`
2. Traduce los archivos `.md` de `content/es/`
3. Añade las traducciones en `js/i18n.js`:

```javascript
translations = {
    // ... idiomas existentes
    'fr': {  // Francés
        'site.title': 'Trésors de Mon Âme',
        // ... más traducciones
    }
}
```

4. Añade la opción en el HTML:
```html
<option value="fr">Français</option>
```

## 🎨 Personalización

### Temas
El sistema de temas usa variables CSS. Puedes personalizar colores editando `styles/main.css`:

```css
:root {
    --color-primary: #tu-color;
    --bg-primary: #tu-fondo;
    /* ... más variables */
}
```

### Contenido
- La fuente canónica en español está en `content/es/` (`1.md`, `2.md`, `introduccion.md`, etc.)
- Las traducciones van en `content/en/` y `content/pt/`
- El sistema carga automáticamente el idioma seleccionado (sin duplicados en la raíz)

## 📱 Responsive Design

### Puntos de Ruptura
- **Desktop**: > 1024px - Sidebar visible, navegación completa
- **Tablet**: 768px - 1024px - Sidebar adaptado
- **Mobile**: < 768px - Sidebar colapsable, navegación optimizada

### Características Móviles
- Menú lateral deslizable
- Controles optimizados para touch
- Navegación por gestos
- Overlay para cerrar menú

## 🔧 Requisitos Técnicos

### Mínimos
- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 12+)
- Para servidor: Python 3.6+

### Recomendados
- Navegador actualizado
- Python 3.8+
- Conexión local (para cargar archivos .md)

## 🤝 Contribución

### Añadir Capítulos
1. Crea el archivo `.md` numerado en `content/es/` (ej: `content/es/34.md`)
2. Añade traducciones en `content/en/` y `content/pt/`
3. El lector detecta capítulos nuevos en `content/es/` automáticamente

### Traducciones
1. Traduce el contenido manteniendo la estructura
2. Actualiza `js/i18n.js` con nuevos textos de interfaz
3. Prueba en el navegador

### Mejoras
- Fork del proyecto
- Crea una rama para tu feature
- Commit y push
- Crea un Pull Request

## 📜 Licencia

Este proyecto está bajo la licencia que el autor especifique.

## 🙏 Agradecimientos

- Creado con amor y dedicación
- Sin frameworks externos por simplicidad
- Diseñado para ser accesible y fácil de usar

---

**📖 Disfruta leyendo "Tesoros de Mi Alma"**