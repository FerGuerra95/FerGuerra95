# M&A VDR Real Phase Status

Fecha: 07/05/2026

## Veredicto

El VDR real queda cerrado como **VDR Real v1 vendible para piloto enterprise controlado**.

```txt
VDR metadata-only: superado
VDR real foundation: cerrado
VDR real v1 operativo: cerrado
VDR financiero global certificado tipo Datasite/Intralinks: pendiente externo/cloud
```

La aplicacion ya no es solo un registro documental: recibe ficheros reales, los persiste server-side, aplica politica de descarga, conserva checksum/version, separa por `organizationId`, registra actividad y permite operar gobierno documental desde `/ma/data-room`.

## Implementado

### Storage documental server-side

- Upload binario real en M&A Data Room.
- Persistencia bajo el data dir de SQLite o `MA_VDR_STORAGE_DIR`.
- Ruta fisica particionada por:
  - `organizationId`;
  - `documentId`;
  - version/nombre normalizado.
- Checksum `SHA-256` por fichero.
- Tamano real en bytes.
- MIME type.
- Nombre original seguro.
- Version inicial `v1`.
- Array `versions` preparado para versionado posterior.

### Seguridad VDR real v1

- Upload requiere `manage:ma_data_room`.
- Download requiere permiso `read`.
- Cada documento se resuelve con `organizationId`.
- Descarga cross-tenant bloqueada.
- Documentos `revoked` o `archived` no son descargables.
- Politica por documento:
  - `allowDownload`;
  - `expiresAt`;
  - `allowedRoles`;
  - `watermarkLabel`;
  - `legalHold`;
  - `retentionUntil`;
  - `purgePolicy`.
- Descarga bloqueada si:
  - el documento esta revocado/archivado;
  - `allowDownload` es `false`;
  - el acceso ha expirado;
  - el rol no esta autorizado.
- Se bloquean extensiones ejecutables peligrosas:
  - `.exe`;
  - `.bat`;
  - `.cmd`;
  - `.ps1`;
  - `.msi`;
  - `.dll`;
  - `.scr`;
  - `.vbs`;
  - `.js`;
  - `.com`.
- Limite inicial de subida: `25 MB`.
- Cabeceras de descarga:
  - `X-MA-Checksum-SHA256`;
  - `X-MA-Watermark`;
  - `X-MA-Document-Classification`;
  - `X-MA-Document-Version`;
  - `X-Content-Type-Options: nosniff`.

### Gobierno documental

- Area VDR:
  - financial;
  - legal;
  - tax;
  - HR;
  - commercial;
  - operations;
  - ESG;
  - technology;
  - other.
- Carpeta libre por documento.
- Expiracion por documento.
- Descarga activable/desactivable sin borrar el fichero.
- Legal hold y retention metadata.
- Archivo de documento desde UI.
- Bloqueo de descarga al archivar.

### Endpoints

```txt
GET   /api/ma/data-room
POST  /api/ma/data-room/documents
POST  /api/ma/data-room/files
PATCH /api/ma/data-room/documents/:id/governance
GET   /api/ma/data-room/documents/:id/download
GET   /api/ma/audit-logs?entityType=ma&entityId=:documentId
```

El upload usa cuerpo binario y headers de metadata:

```txt
X-MA-File-Name
X-MA-Document-Title
X-MA-Document-Type
X-MA-Classification
X-MA-Document-Status
X-MA-Area
X-MA-Folder
X-MA-Allow-Download
X-MA-Access-Expires-At
X-MA-Watermark-Label
X-MA-Allowed-Roles
X-MA-Legal-Hold
X-MA-Retention-Until
X-MA-Case-Id
X-MA-Report-Id
```

### UI

- `/ma/data-room` permite seleccionar fichero real.
- Formulario con:
  - titulo;
  - tipo;
  - clasificacion;
  - estado;
  - area;
  - carpeta;
  - expiracion;
  - watermark;
  - retention;
  - download enabled;
  - legal hold.
- Tabla con:
  - area/carpeta;
  - estado;
  - politica de acceso;
  - roles permitidos;
  - tamano;
  - checksum parcial;
  - accion de descarga;
  - lock/unlock de descarga;
  - archive;
  - export de audit por documento.
- Metrica: server-side files.

### Audit trail

Eventos VDR:

```txt
ma.data_room.document.created
ma.data_room.file.uploaded
ma.data_room.file.downloaded
ma.data_room.document.governance_updated
```

Mejora aplicada:

- `listAuditLogs` soporta `entityId`.
- La UI permite exportar el access log de un documento concreto.
- Las descargas registran checksum y watermark marker.

## QA ejecutado

```txt
node --check backend/services/ma/dataRoom.service.js       OK
node --check backend/api/controllers/ma.controller.js      OK
node --check backend/api/routes/ma.routes.js               OK
node --check backend/api/validators/ma.validator.js        OK
node --check src/modules/ma/services/maDataRoomApi.js      OK
node --check tests/integration/services/maServices.test.js OK
npm run test:unit                                          OK - 13 files, 65 tests
npm run test:integration                                   OK - 6 files, 12 tests
npm run build                                              OK
npx playwright test tests/e2e/ma/enterprise-routes.spec.js TIMEOUT en esta pasada; procesos colgados cerrados
```

## Estado de venta

Vendible ahora como:

```txt
VDR Real v1 para M&A Intelligence Pilot / SaaS enterprise controlled rollout.
```

No vender todavia como:

```txt
Virtual Data Room financiero global certificado tipo Datasite/Intralinks.
```

## Que queda fuera del cierre tecnico v1

Estas piezas no se pueden dar por cerradas sin proveedores externos, infraestructura cloud o certificacion formal:

1. Antivirus/malware scanning real con motor externo.
2. Cifrado en reposo con KMS/cloud tenant secret.
3. Multipart/chunk upload resumible para ficheros muy grandes.
4. Watermark fisico inyectado dentro de PDF/Office; hoy queda como watermark marker/audit/header.
5. Preview seguro de PDF/Office sin descarga directa.
6. OCR/chunking y busqueda full-text/AI retrieval.
7. Versionado binario avanzado con reemplazo/diff.
8. Permisos por destinatario externo concreto.
9. Legal hold/purge automatizado con jobs y aprobaciones.
10. Backup/restore formal de binarios probado en entorno cloud.
11. Auditoria externa/SOC 2/ISO/DPA/SLA.

## Punto exacto para roadmap

```txt
Fase 4.5 - VDR Real v1: cerrada tecnicamente.
Siguiente fase real: VDR Cloud Hardening + certificacion operativa externa.
```
