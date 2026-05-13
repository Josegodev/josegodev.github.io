# Portfolio AI - José González Oliva

Portfolio tecnico estatico para GitHub Pages, orientado a reclutadores y perfiles tecnicos que quieran evaluar experiencia en backend, IA aplicada, RAG, observabilidad y automatizacion.

El sitio no usa frameworks, dependencias, npm ni datos sensibles. Esta construido solo con HTML, CSS y muestras JSON.

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
- `samples/`: trazas JSON de ejemplo sin datos sensibles.

## Como editar

- Cambia textos principales en `docs/index.html`.
- Edita cada caso en `docs/case-studies/*.html`.
- Ajusta colores, espaciados y responsive en `docs/styles.css`.
- Actualiza ejemplos tecnicos en `samples/*.json`.

Mantener el portfolio creible: no incluir tokens, IPs privadas, nombres de clientes, documentacion contractual, credenciales ni metricas no verificadas.
