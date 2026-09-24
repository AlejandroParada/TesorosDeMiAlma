# Modelo DRY de contenido

## Fuente canónica

El contenido del libro **no se duplica en la raíz**. La única fuente por idioma es:

| Idioma | Ruta |
|--------|------|
| Español (base) | `content/es/` |
| English | `content/en/` |
| Português | `content/pt/` |

Archivos por idioma: `portada.md`, `dedicatoria.md`, `introduccion.md`, `1.md`…`N.md`, y `glosario/*.md`.

## Carga en runtime

`js/book-clean.js` (activo vía `index.html`) hace fetch a:

```
content/{lang}/portada.md
content/{lang}/dedicatoria.md
content/{lang}/introduccion.md
content/{lang}/{n}.md
```

La detección del total de capítulos sondea siempre `content/es/{n}.md`.

## Flujo de edición

1. Editar / añadir capítulos primero en **`content/es/`**
2. Reflejar cambios en `content/en/` y `content/pt/`
3. No crear `1.md`, `2.md`, etc. en la raíz del repo

## Nota histórica

Antes existían copias en la raíz sincronizadas con `content/es/`. Ese modelo se eliminó para evitar desfasajes (DRY).
