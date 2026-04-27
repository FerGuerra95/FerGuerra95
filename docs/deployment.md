# Despliegue

## Entornos
- **local**
- **staging**
- **production**

## Variables de entorno
- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `STORAGE_BUCKET`
- `EMAIL_PROVIDER_KEY`
- `TRANSLATION_API_KEY`
- `OCR_API_KEY`
- `RAG_API_KEY`

## Requisitos
- Base de datos accesible.
- Almacenamiento de archivos.
- Sistema de logs y monitorización.
- Backups.

## Flujo recomendado
1. Desplegar backend.
2. Ejecutar migraciones.
3. Cargar seed inicial si aplica.
4. Desplegar frontend.
5. Validar health checks.
6. Activar monitorización y alertas.

## Buenas prácticas
- No desplegar sin `.env` validado.
- Mantener staging alineado con producción.
- Versionar API y migraciones.
- Registrar fallos de jobs y reintentos.
