# Portfolio AI - José González Oliva

Portfolio tecnico estatico para GitHub Pages, orientado a reclutadores y perfiles tecnicos que quieran evaluar experiencia en backend, IA aplicada, RAG, observabilidad, integraciones y automatizacion.

Este repositorio es una vista publica, curada y segura de trabajo realizado en repositorios y laboratorios privados/locales. No publica codigo fuente privado, corpus documental real, logs reales, tokens, IPs privadas ni rutas locales.

El sitio no usa frameworks, dependencias, npm ni datos sensibles. Esta construido solo con HTML, CSS y muestras JSON sinteticas.

## Publicacion en GitHub Pages

1. Sube este repositorio a GitHub.
2. Entra en `Settings`.
3. Abre `Pages`.
4. En `Build and deployment`, selecciona `Deploy from a branch`.
5. Selecciona la rama `main`.
6. Selecciona la carpeta `/docs`.
7. Guarda la configuracion.

GitHub publicara el contenido de `docs/index.html` como pagina principal.

## Contenido

- `docs/index.html`: pagina principal del portfolio.
- `docs/styles.css`: estilos responsive del sitio.
- `docs/.nojekyll`: evita procesamiento Jekyll en GitHub Pages.
- `docs/case-studies/`: paginas de casos tecnicos.
- `samples/`: trazas y ejemplos RAG sinteticos sin datos sensibles.

## Como editar

- Cambia textos principales en `docs/index.html`.
- Edita cada caso en `docs/case-studies/*.html`.
- Ajusta colores, espaciados y responsive en `docs/styles.css`.
- Actualiza ejemplos tecnicos en `samples/*.json`.

Mantener el portfolio creible:

- No incluir tokens, credenciales, IPs privadas ni rutas locales reales.
- No publicar nombres de clientes, documentacion contractual, corpus privado, SQLite real, logs reales ni trazas con identificadores reales.
- No afirmar produccion, alta concurrencia, cloud productivo o seguridad enterprise si no hay evidencia publica reproducible.
- Usar ejemplos sinteticos y explicar las limitaciones actuales.
