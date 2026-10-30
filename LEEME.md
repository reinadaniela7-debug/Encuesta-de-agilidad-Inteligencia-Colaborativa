# Postula tu proyecto · Células ágiles

Formulario para que los gerentes postulen proyectos para las células de inteligencia colaborativa. Cada postulación se ubica sola en la matriz de Stacey, muestra qué criterios cumple y se guarda como una fila en Google Sheets.

## Archivos

- `index.html`: el formulario (la página que se publica en GitHub Pages).
- `Codigo.gs`: el script de Google que recibe las postulaciones y las guarda en la hoja.

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

## Cómo se calcula la zona

Cada eje es el promedio de 4 preguntas en escala de 1 a 5 (5 = más falta de claridad o de alineación). Se mide la distancia al origen de la matriz y se ubica en una banda: simple, complicado, complejo o caos. Es una guía para conversar, no una medición exacta.

## Nota

Las respuestas llegan a la hoja. Cualquiera con el enlace puede enviar el formulario, pero solo quien tenga acceso a la hoja ve las postulaciones.
