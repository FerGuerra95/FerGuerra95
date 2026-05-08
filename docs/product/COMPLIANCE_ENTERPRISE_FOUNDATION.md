# Compliance Enterprise Foundation

Fecha: 08/05/2026

## Veredicto

La rama **Compliance Enterprise v1** queda cerrada tecnicamente y conectada al Executive Overviewer como contraparte enterprise de M&A.

```txt
Compliance local/demo: existente
Compliance enterprise foundation: implementado
Rule engine determinista: implementado
Evidence Vault link por control: implementado
Impacto M&A por riesgo legal: implementado
Audit Run Detail + Audit Ledger: implementado
Executive Overviewer integration: implementado
Compliance enterprise closure tecnica: cerrada
Certificacion legal/SLA externa: pendiente externo
```

## Objetivo cerrado en esta fase

La primera fase no intenta cubrir todas las normas del mundo. Cierra la arquitectura correcta:

- cada ejecucion de compliance queda persistida;
- cada resultado de regla queda trazado;
- cada control cumplido puede vincular evidencia real;
- cada ejecucion respeta `organizationId`;
- si hay riesgo legal conectado a M&A, se genera impacto en el multiplo EBITDA.
- cada audit run se puede revisar regla por regla y exportar como ledger JSON con digest reproducible;
- el dashboard del CEO centraliza M&A + Compliance en un unico Command Center.

## Cambios aplicados

### Hardening Zero Trust legacy

Se endurecieron los servicios legacy de Compliance para dejar de depender de
listar todo y filtrar en memoria.

Archivos:

```txt
backend/services/compliance/suppliers.service.js
backend/services/compliance/alerts.service.js
backend/services/compliance/evidence.service.js
backend/services/compliance/reviews.service.js
backend/services/compliance/reports.service.js
```

Patron aplicado:

- `listByOrganization`;
- `getByIdForOrganization`;
- `updateForOrganization`;
- `removeForOrganization`.

Resultado:

- un `supplierId`, `alertId`, `evidenceId`, `reviewId` o `reportId` ajeno ya no se resuelve fuera de su organizacion;
- las cascadas de borrado operan solo dentro de la organizacion;
- los servicios quedan alineados con el patron enterprise usado en M&A.

### Migracion enterprise

Archivo:

```txt
backend/storage/migrations/003_compliance_enterprise.sql
```

Tablas nuevas:

- `compliance_audit_runs`;
- `compliance_rule_results`;
- `compliance_rule_evidence_links`;
- `compliance_ma_risk_impacts`.

Todas incluyen `organization_id` y estan indexadas por organizacion.

### Cierre enterprise

Archivos:

```txt
backend/storage/migrations/004_compliance_enterprise_closure.sql
backend/services/compliance/executiveHub.service.js
src/modules/compliance/pages/ComplianceAuditDetail.jsx
src/modules/ceo-overview/pages/ExecutiveOverviewer.jsx
src/modules/ceo-overview/pages/CEOOverviewPage.jsx
```

Resultado:

- `compliance_reports` incorpora `executive_summary_json`;
- los reportes de Compliance generan `executiveSummary` estructurado;
- el Overviewer consume el briefing de Compliance desde backend;
- `/dashboard` pasa a ser la entrada principal del Command Center;
- `/compliance/audit-runs` muestra historial, detalle de reglas y evidencias;
- cada audit run permite exportar un JSON con digest `CEO_OS_LEDGER_DIGEST_V1` y firma simulada `SIMULATED_SHA256_LEDGER_V1`.

### Rule Engine determinista

Archivo:

```txt
backend/services/compliance/ruleEngine.service.js
```

Reglas iniciales:

- GDPR Art. 28 - DPA requerido.
- GDPR Art. 33 - respuesta a brechas.
- ISO 27001 - access control.
- ISO 27001 - risk treatment plan.
- SOC 2 - informe independiente.
- CSDDD - due diligence reforzada para proveedor de alto riesgo.

Las reglas se ejecutan con funciones fijas. No hay IA decidiendo si una norma aplica.

### Evidence Vault linkage

Cada regla busca evidencia documental existente en `compliance_evidence` usando:

- `supplierId`;
- `sourceType` documental: `document`, `audit`, `certification`, `external_report`;
- keywords fijas por regla;
- umbral de confianza determinista.

Cuando una regla pasa, se crea un link en:

```txt
compliance_rule_evidence_links
```

con `citation_json` incluyendo:

- `evidenceId`;
- titulo;
- source type;
- source URL;
- confidence;
- excerpt;
- `ruleId`;
- `controlRef`.

### Audit Runs

Archivo:

```txt
backend/services/compliance/auditRuns.service.js
```

Responsabilidades:

- carga datos por `organizationId`;
- ejecuta reglas;
- persiste audit run;
- persiste resultados;
- persiste links de evidencia;
- registra audit ledger;
- calcula score ejecutivo 0-100.

### API Zero Trust

Nuevos archivos:

```txt
backend/api/controllers/compliance.controller.js
backend/api/routes/compliance.routes.js
backend/api/validators/compliance.validator.js
```

Rutas:

```txt
GET  /api/compliance/audit-runs
POST /api/compliance/audit-runs
GET  /api/compliance/audit-runs/:id
GET  /api/compliance/audit-runs/:id/ledger-export
GET  /api/compliance/ma-risk-impacts?maCaseId=:id
GET  /api/compliance/hub-overview
```

La API va montada detras de `requireAuth` y exige permisos:

- `read`;
- `run:compliance_audit`.

### Puente Compliance -> M&A

Backend:

```txt
backend/services/compliance/auditRuns.service.js
```

Frontend/engine M&A:

```txt
src/modules/ma/engine/complianceValuationBridge.js
src/modules/ma/engine/useValuationEngine.js
```

Regla de descuento:

```txt
legalRiskScore >= 85 o criticalFindings >= 3  => -1.25x EBITDA
legalRiskScore >= 70                          => -0.80x EBITDA
legalRiskScore >= 55                          => -0.45x EBITDA
legalRiskScore >= 35                          => -0.20x EBITDA
menos de 35                                   =>  0.00x EBITDA
```

Cuando el audit run recibe `maCaseId`, se crea:

```txt
compliance_ma_risk_impacts
```

y se actualiza el caso M&A con:

```txt
settings.complianceRiskImpact
```

El motor M&A ya aplica ese delta si el caso lo trae en settings.

Ademas, cuando un audit run se completa con `maCaseId`, el caso M&A queda marcado como dirty:

```txt
settings.complianceRiskImpact.requiresValuationRecalculation = true
settings.complianceRiskImpact.valuationDirty = true
settings.valuationRecalculation.status = "dirty"
settings.valuationRecalculation.source = "compliance"
```

Esto fuerza a revisar/recalcular la valoracion ajustada por riesgo legal.

### Executive Dashboard UI

Archivos:

```txt
src/modules/compliance/services/complianceAuditApi.js
src/modules/compliance/pages/ComplianceDashboardPage.jsx
```

La pantalla principal de Compliance ahora incluye:

- panel "Enterprise rule engine";
- boton `Run audit`;
- score CEO 0-100;
- risk level;
- critical findings;
- evidence coverage;
- listado de ultimos audit runs;
- enlaces al detalle de cada audit run;
- acceso al Audit Ledger;
- feedback de error si la API no puede ejecutar la auditoria.

El dashboard sigue mostrando tambien:

- proveedores monitorizados;
- riesgo medio;
- alertas abiertas;
- cobertura documental;
- top proveedores por riesgo;
- ultimas alertas.

### Audit Run Detail View

Ruta:

```txt
/compliance/audit-runs
/compliance/audit-runs/:id
```

La vista muestra:

- historial de auditorias por organizacion;
- cada regla ejecutada;
- estado `passed`, `failed`, `warning` o `not_applicable`;
- framework y control reference;
- evidencia vinculada desde Evidence Vault;
- titulo del documento, excerpt citado, confidence y source URL;
- exportacion JSON del ledger para auditores externos.

### Executive Overviewer / Command Center

Ruta principal:

```txt
/dashboard
```

Integracion aplicada:

- wrapper estable `ExecutiveOverviewer.jsx`;
- `/overview` y `/ceo/overview` siguen disponibles como alias;
- login redirige a `/dashboard`;
- widgets del Overviewer son clicables hacia M&A, Compliance y Funding;
- widget `Deal Readiness Index` combina M&A Valuation Signal + Legal/Compliance Health;
- si Compliance baja, se visualiza el drag sobre readiness comercial;
- radar de salud corporativa con ejes:
  - Legal: dato backend Compliance;
  - Financial M&A: dato de casos/valoracion M&A;
  - Operational: placeholder estable;
  - ESG: placeholder estable;
  - Funding: dato de readiness Funding.

## QA ejecutado

```txt
node --check backend/services/compliance/ruleEngine.service.js    OK
node --check backend/services/compliance/auditRuns.service.js     OK
node --check backend/api/controllers/compliance.controller.js     OK
node --check backend/api/routes/compliance.routes.js              OK
node --check backend/api/validators/compliance.validator.js       OK
node --check tests/integration/services/complianceApi.test.js     OK
node --check backend/services/compliance/suppliers.service.js     OK
node --check backend/services/compliance/alerts.service.js        OK
node --check backend/services/compliance/evidence.service.js      OK
node --check backend/services/compliance/reviews.service.js       OK
node --check backend/services/compliance/reports.service.js       OK
node --check backend/services/compliance/executiveHub.service.js  OK
node --check src/modules/compliance/services/complianceAuditApi.js OK
npm run test:unit                                                 OK - 14 files, 67 tests
npm run test:integration                                          OK - 6 files, 14 tests
npm run build                                                     OK
```

## Cobertura nueva

- migracion `003_compliance_enterprise` aplicada;
- migracion `004_compliance_enterprise_closure` aplicada;
- tablas enterprise de compliance existentes;
- audit run determinista;
- links de evidencia por regla;
- impacto M&A generado;
- settings del caso M&A actualizado con `complianceRiskImpact`;
- caso M&A marcado dirty cuando audit run vinculado completa;
- ledger JSON exportable con digest reproducible;
- executive summary estructurado en reportes Compliance;
- endpoint `hub-overview` para el Overviewer;
- bloqueo cross-tenant por `supplierId`;
- bloqueo cross-tenant por `maCaseId`;
- puente unitario M&A para descuento de multiplo.
- hardening legacy por organizacion;
- borrado cross-tenant bloqueado;
- cascada de proveedor limitada a su organizacion;
- dashboard ejecutivo conectado a audit runs.
- vista Audit Run Detail conectada;
- `/dashboard` conectado a M&A + Compliance con Deal Readiness y radar.

## Pendiente siguiente fase

1. Selector avanzado de proveedor/caso M&A al ejecutar auditorias desde la UI.
2. Visual avanzado en M&A Valuation para mostrar el descuento por compliance dentro del caso.
3. Export PDF executive compliance pack.
4. Rol/portal read-only para auditor externo con permisos limitados.
5. Ampliar rule packs:
   - GDPR retention;
   - ISO 27001 supplier relationship;
   - SOC2 change management;
   - CSDDD grievance mechanism;
   - ESG/CSRD evidences.
6. Migrar pantallas secundarias legacy a backend-first si se quiere abandonar local/demo store.
7. Revision legal/SLA externa, DPA, retention policy y auditoria formal si se vende como SaaS certificado.

## Punto exacto para roadmap

```txt
Compliance Enterprise Foundation: implementado.
Zero Trust hardening legacy: implementado.
Executive Dashboard audit run: implementado.
Compliance Enterprise Closure tecnica: cerrada.
Executive Overviewer M&A + Compliance: implementado.
Siguiente sprint: PDF compliance pack + auditor external read-only + reglas ampliadas.
```
