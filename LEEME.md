# Postula una interacción · Células ágiles

Formulario para que las personas propongan interacciones entre áreas que conviene mejorar. Pide cuatro datos: nombre, la interacción a mejorar, las áreas involucradas y por qué es de alto impacto. Cada respuesta se guarda como una fila en la pestaña "Sugerencias" de Google Sheets.

## Archivos

- `index.html`: el formulario (la página que se publica en GitHub Pages).
- `Codigo.gs`: el script de Google que recibe las postulaciones, las guarda en la hoja y se las entrega a la página de resultados.
- `resultados.html`: tablero en vivo de las postulaciones, protegido con clave (se actualiza cada 30 segundos).

## Instalación (una sola vez, unos 10 minutos)

### 1. Conectar la hoja de Google

1. Crea una Google Sheet nueva, por ejemplo "Postulaciones células ágiles".
2. En la hoja, ve a **Extensiones › Apps Script**.
3. Borra lo que aparezca y pega todo el contenido de `Codigo.gs`. Guarda.
4. Pulsa **Implementar › Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
5. Autoriza los permisos que pide Google y copia la **URL de la aplicación web** (termina en `/exec`).

### 2. Pegar la URL en el formulario

En `index.html`, busca esta línea y pega la URL entre las comillas:

```js
API_URL:''
```

Si la dejas vacía, la página funciona en modo de prueba: se puede llenar, pero no guarda nada.

### 3. Publicar en GitHub Pages

En el repositorio: **Settings › Pages › Deploy from a branch**, rama `main`, carpeta `/ (root)`. En uno o dos minutos la página queda en
`https://<tu-usuario>.github.io/<nombre-del-repositorio>/`.

Ese es el enlace (y el QR) que se comparte con los gerentes.

## Página de resultados

La página `resultados.html` muestra todas las postulaciones en vivo: total, áreas más mencionadas (con filtro por área) y la lista completa, con descarga en CSV. Pide una clave; sin ella, Google no entrega ningún dato.

Para activarla (una sola vez):

1. En Apps Script, reemplaza el código por la versión nueva de `Codigo.gs` y guarda.
2. Ve a **Configuración del proyecto** (el engranaje) › **Propiedades de la secuencia de comandos** › **Agregar propiedad**. Nombre: `CLAVE_RESULTADOS`. Valor: la clave que quieras. Guarda.
3. Ve a **Implementar › Administrar implementaciones**, pulsa el lápiz de la implementación actual, en **Versión** elige **Nueva versión** e **Implementar**. Así la URL no cambia.

La clave nunca va en el código, porque este repositorio es público. Tras 10 intentos fallidos, la página se bloquea 10 minutos.

## Nota

Las respuestas llegan a la hoja. Cualquiera con el enlace puede enviar el formulario, pero solo quien tenga acceso a la hoja ve las postulaciones.
