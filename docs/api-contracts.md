# Contratos de API

## Auth
### POST /api/auth/login
**Body**
```json
{ "email": "user@example.com", "password": "secret" }
```

**Response**
```json
{ "token": "jwt-token", "user": { "id": "u1", "role": "admin" } }
```

## M&A
### GET /api/ma/cases
Lista casos de M&A.

### POST /api/ma/cases
Crea un nuevo caso.

### GET /api/ma/reports/:id
Obtiene metadatos de un reporte.

## Compliance
### GET /api/suppliers
Lista proveedores.

### POST /api/suppliers
Crea proveedor.

### GET /api/alerts
Lista alertas.

### GET /api/evidence/:id
Devuelve evidencia detallada y citas.

### POST /api/reviews
Registra decisión de revisión.

### GET /api/reports/compliance/:id
Obtiene metadatos del reporte de compliance.

## Convenciones
- Respuestas JSON.
- Errores con formato:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```
- Todas las rutas protegidas salvo login.
