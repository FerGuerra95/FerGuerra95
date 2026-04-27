# Arquitectura del Proyecto

## Visión general
La plataforma se divide en dos workspaces de negocio sobre una carcasa común:

- **M&A**: valoración, waterfall, buyer matching, reporting.
- **Compliance**: proveedores, riesgos, alertas, evidencia, revisiones, reportes.

La arquitectura se organiza en capas:

1. **Frontend modular** (`src/`)
2. **Backend/API** (`backend/`)
3. **Testing** (`tests/`)
4. **Documentación** (`docs/`)
5. **Infraestructura** (`infra/`)

## Frontend
### app/
Carcasa global con layout, router, providers y store compartido.

### shared/
Componentes, utils y hooks reutilizables por cualquier workspace.

### modules/ma/
Workspace de valoración M&A.

### modules/compliance/
Workspace de Supply Chain Compliance.

## Backend
### api/
Rutas, controladores, middlewares y validadores.

### auth/
Autenticación, permisos y sesiones.

### domain/
Modelos de dominio separados en `ma/` y `compliance/`.

### services/
Lógica de negocio agrupada por módulo.

### jobs/
Procesos en background: rescans, traducciones, snapshots, reportes.

### integrations/
Conectores externos: RAG, traducción, noticias, geodata, OCR, notificaciones y email.

## Principios de diseño
- Separar carcasa, shared y módulos.
- No mezclar la lógica de M&A con Compliance.
- Mantener el backend como fuente de verdad.
- Dejar RAG y enriquecimiento desacoplados mediante integraciones y jobs.
- Diseñar con revisión humana para Compliance.
