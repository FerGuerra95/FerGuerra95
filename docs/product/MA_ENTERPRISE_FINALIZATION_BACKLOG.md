# M&A Enterprise Finalization Backlog

Fecha: 07/05/2026

Objetivo: documentar el estado real de M&A despues del cierre enterprise privado y de la primera capa SaaS enterprise foundation.

## Veredicto actual

M&A queda en estado vendible y elevado a SaaS enterprise foundation v1:

```txt
CEO's OS M&A Intelligence Pilot
Precio defendible: 3.000 EUR por caso
Uso: valuation, waterfall, buyer matching, CIM, repositorio, data room, trazabilidad y export confidencial.
```

No debe venderse todavia como SaaS enterprise global certificado con SLA formal y paquete legal completo. Si puede venderse como SaaS enterprise controlado con onboarding, revision humana, permisos, multi-tenancy, data room inicial y distribucion controlada.

## Cierre ya realizado

### Producto M&A

- 8 rutas visibles del workspace M&A cubiertas y validadas por e2e:
  - `/ma/dashboard`
  - `/ma/valuation`
  - `/ma/pipeline`
  - `/ma/waterfall`
  - `/ma/matching`
  - `/ma/cim`
  - `/ma/deals`
  - `/ma/data-room`
- Capa visual enterprise aplicada a las rutas M&A.
- Pipeline corregido para usar ruta real `/ma/pipeline`.
- Eliminado residuo legacy de navegacion `/ma/dashboard#deal-pipeline`.
- Dashboard, Valuation, Waterfall, Buyer Matching, CIM y Repository quedan visualmente coherentes como suite ejecutiva.
- Demo tools gobernados por `VITE_PUBLIC_DEMO_MODE=true`.
- Fallback local M&A solo permitido en desarrollo si `VITE_ENABLE_MA_LOCAL_FALLBACK=true`.

### Demo enterprise

- 3 casos demo premium centralizados en `src/shared/config/demoData.js`:
  - industrial services rentable;
  - SaaS/software con crecimiento;
  - empresa familiar de precision components con dependencia del propietario.
- Pipeline demo y detalles de deals consumen los datos centralizados.
- `/ma/valuation` carga el caso principal y prepara los 3 casos enterprise cuando demo mode esta activo.
- Los casos incluyen narrativa, financials, buyer fit, riesgos, evidencias, valuation snapshot y geografia.

### Informes y export

- CIM conectado al generador profesional.
- Informe antiguo reemplazado por wrapper hacia:
  - `formatMAReportData`
  - `buildMAReportHtml`
- Informe renombrado como `Confidential M&A Executive Report`.
- Metadata del informe con `noindex,nofollow`.
- Disclaimer reforzado:
  - no legal advice;
  - no tax advice;
  - no audit;
  - no investment advice;
  - no fairness opinion;
  - requiere human review;
  - requiere source validation;
  - requiere confirmatory due diligence;
  - requiere professional adviser review;
  - distribucion controlada bajo NDA.
- Evidence Control Pack incluido en informe.

### Secure sharing

- Backend real de secure sharing M&A implementado sobre `secure_share_links`.
- Endpoints disponibles:
  - `POST /api/ma/reports/:id/share`
  - `GET /api/ma/secure-shares/:id`
  - `DELETE /api/ma/secure-shares/:id`
- Token aleatorio con hash server-side.
- Caducidad configurable.
- Revocacion server-side.
- Control por `organizationId`.
- Acceso autenticado, sin enlace publico anonimo.
- Auditoria de creacion, acceso y revocacion.
- El boton de secure share crea report server-side y enlace seguro cuando no recibe handler externo.

### Seguridad y trazabilidad M&A

- Multi-tenancy por `organizationId` desde backend/token.
- Export, borrado y secure share gobernados por permisos.
- Audit logs M&A para:
  - crear caso;
  - acceder a caso;
  - editar caso;
  - borrar caso;
  - crear snapshot;
  - exportar informe;
  - crear secure share;
  - abrir secure share;
  - revocar secure share.
- Logs sin token plano ni documento completo.

### SEO

- `index.html` actualizado:
  - title profesional;
  - meta description;
  - keywords;
  - canonical;
  - Open Graph;
  - Twitter card;
  - theme color;
  - robots.

### QA ejecutado

Ultima validacion pasada:

```txt
npm run build                         OK
npm run test:unit                     OK - 65 passed
npm run test:integration              OK - 10 passed
npx playwright test tests/e2e/ma      OK - 6 passed
```

Cobertura nueva relevante:

- Integracion: secure share crea, valida token, rechaza token incorrecto y revoca.
- E2E: recorre las 8 rutas M&A y valida que renderizan contenido de producto.
- E2E final readiness: valida rutas representativas en desktop/mobile sin overflow horizontal, mojibake, `undefined`, `NaN` ni datos rotos.
- E2E PDF/A4: genera screenshot y PDF del `Confidential M&A Executive Report` con governance strip, Evidence Control Pack y disclaimer.

## Cierre final aplicado el 07/05/2026

Esta ultima pasada deja resueltos los puntos que bloqueaban vender M&A como piloto enterprise privado:

- capa visual M&A reforzada con guardrails de overflow, radios sobrios y densidad ejecutiva;
- informe HTML/PDF elevado a salida confidencial A4-ready con governance notice;
- datos demo completados para evitar placeholders, revenue cero, buyer fit indefinido o tesis generica;
- export/secure sharing descrito como flujo autenticado, no como data room completo;
- sales pack de 3.000 EUR creado en `docs/product/MA_ENTERPRISE_SALES_PACK_3000.md`;
- Playwright estabilizado para M&A con login API, worker unico y modo `CEOS_E2E`;
- build/unit/integration/e2e M&A verdes.

## Capa SaaS enterprise foundation aplicada

- Runner de migraciones versionadas en `backend/storage/migrationRunner.js`.
- Migracion `002_ma_enterprise_saas.sql` con `ma_deals` y `ma_data_room_documents`.
- Nueva ruta SaaS `/ma/data-room`.
- Endpoints:
  - `GET /api/ma/data-room`;
  - `POST /api/ma/data-room/documents`.
- Secure shares sincronizados con data room al crear/revocar enlaces.
- Permisos especificos:
  - `create:ma_share`;
  - `revoke:ma_share`;
  - `manage:ma_data_room`.
- QA adicional de migraciones, data room multi-tenant y viewer read-only.

## Fase 4 certified-ready aplicada

- Servicio/API/UI real sobre `ma_deals`.
- Endpoints `GET/POST/PATCH/DELETE /api/ma/deals`.
- `/ma/pipeline` carga deals desde backend real y permite sincronizar pipeline visible.
- `/ma/data-room` permite revocar secure shares desde UI.
- Audit ledger M&A visible y exportable en JSON.
- Permisos enterprise ampliados:
  - `create:ma_deal`;
  - `update:ma_deal`;
  - `delete:ma_deal`;
  - `read:audit_log`.
- QA de pipeline multi-tenant y audit export.

## Pendiente para certificacion formal externa

Lo siguiente ya no bloquea vender M&A como SaaS enterprise controlado. Es el backlog externo para certificarlo formalmente con contratos, auditoria y operacion productiva.

### 1. QA visual continuo

Prioridad: media.

Estado v1: cerrado para piloto por e2e y spot-check A4.

Mantener como rutina antes de demos o cambios grandes:

- `/ma/dashboard`
- `/ma/valuation`
- `/ma/pipeline`
- `/ma/waterfall`
- `/ma/matching`
- `/ma/cim`
- `/ma/deals`
- `/ma/data-room`

Validar:

- textos no cortados;
- botones no solapados;
- mobile y desktop correctos;
- densidad de producto, no maqueta;
- estados vacios profesionales;
- navegacion lateral sin duplicidades;
- coherencia ES/EN segun mercado objetivo.

Por donde empezar:

```txt
1. npm run dev
2. entrar como admin demo
3. recorrer las 8 rutas M&A
4. capturar screenshots desktop y mobile
5. corregir solo problemas visibles reales
```

### 2. PDF / print enterprise completo

Prioridad: media-alta.

Estado v1: cerrado para piloto. El e2e final genera screenshot y PDF A4 desde el builder profesional y valida governance, evidence pack y ausencia de datos rotos.

Mantener prueba manual si se cambia:

- `/ma/valuation`
- `/ma/cim`

Y revisar:

- portada;
- titulo;
- valuation range;
- equity value;
- methodology;
- waterfall;
- buyer matching;
- risks;
- evidence control;
- human review;
- disclaimer;
- saltos de pagina;
- margenes;
- legibilidad al guardar como PDF;
- si se ve como informe aceptable para comite de multinacional.

Por donde empezar:

```txt
1. Cargar caso demo enterprise
2. Ir a /ma/cim
3. Imprimir / Guardar PDF
4. Revisar el PDF visualmente
5. Ajustar buildMAReportHtml.js si algo no esta al nivel
```

### 3. Copy ES/EN final

Prioridad: media-alta.

M&A mezcla castellano e ingles. Para venta multinacional hay dos opciones:

- producto en ingles completo;
- producto bilingue por mercado.

Decision recomendada:

```txt
UI principal en ingles ejecutivo.
Mensajes comerciales/soporte en castellano si el cliente es local.
Informe en ingles por defecto.
```

Falta revisar:

- botones;
- badges;
- titulos;
- descripciones;
- toasts;
- empty states;
- labels de informe.

### 4. Data room avanzado

Prioridad: baja-media despues de Fase 4 tecnica.

La base SaaS ya existe: ruta `/ma/data-room`, tabla `ma_data_room_documents`, endpoints de data room, sincronizacion con secure shares, revocacion UI y audit ledger exportable. Para data room certificado completo falta:

- vista segura de documento compartido;
- historial visible para administradores;
- permisos granulares por rol;
- watermark opcional;
- descarga controlada;
- expiracion con edicion desde UI;
- storage documental server-side si se separa de `ma_reports.payload`.

Hasta entonces vender como:

```txt
controlled M&A data room foundation + authenticated secure sharing
```

No vender aun como:

```txt
full virtual data room enterprise
```

### 5. Pipeline enterprise

Prioridad: cerrado tecnicamente.

Ya existe tabla `ma_deals` por migracion SaaS, servicio/API/UI real y sincronizacion desde `/ma/pipeline`. Para ampliar en producto operativo futuro:

- drag and drop entre fases;
- comentarios por deal;
- adjuntos por deal;
- owner asignable desde usuarios reales;
- IC memo workflow completo.

No es bloqueante para venta SaaS controlada.

### 6. Documentacion comercial

Prioridad: cerrada para piloto, alta para contrato SaaS.

Estado v1: cerrado en `docs/product/MA_ENTERPRISE_SALES_PACK_3000.md`.

Ya queda documentado:

- propuesta comercial de 3.000 EUR;
- alcance exacto;
- exclusiones;
- guion demo M&A de 8-12 minutos;
- checklist de inputs necesarios;
- disclaimer comercial;
- terminos operativos del piloto;
- criterio de aceptacion.

Pendiente solo si se vende como SaaS o contrato enterprise formal:

- contrato revisado por abogado;
- DPA/RGPD;
- SLA;
- anexos de seguridad;
- politica de retencion y borrado.

Oferta recomendada:

```txt
CEO's OS M&A Intelligence Pilot
3.000 EUR / caso
Incluye workspace privado, valuation, waterfall, buyer matching, CIM, informe confidencial y sesion ejecutiva.
No incluye due diligence legal/fiscal/financiera, auditoria, fairness opinion ni busqueda real de compradores.
```

### 7. QA enterprise adicional

Prioridad: media para ampliacion productiva, no bloqueante tras Fase 4.

Faltan tests especificos:

- test de produccion sin local fallback;
- test multi-tenant via API para endpoints M&A.

Ya cubierto en v1:

- e2e de 8 rutas M&A;
- e2e final desktop/mobile sin overflow ni textos rotos;
- e2e de informe A4 con screenshot/PDF;
- test de informe con Evidence Control Pack;
- integracion secure share.
- integracion de migraciones SaaS y data room multi-tenant.
- integracion de pipeline `ma_deals` multi-tenant.
- test unitario de permisos enterprise.

### 8. Legal / compliance operativo

Prioridad: alta para multinacional real.

Falta preparar:

- DPA/RGPD;
- privacy policy especifica;
- terms of service;
- data retention policy;
- security one-pager;
- incident response summary;
- subprocessors list si aplica;
- disclaimer de uso de IA si se conecta IA real;
- backup/restore policy;
- SLA o soporte definido si se vende como SaaS.

## Orden recomendado para continuar

### Sprint 1: enterprise hardening transversal

1. Preparar DPA/RGPD, privacy, terms y SLA para revision legal.
2. Definir billing/licensing definitivo.
3. Ejecutar auditoria externa de seguridad.
4. Probar backup/restore en staging/productivo.
5. Cerrar runbooks operativos.

Resultado esperado:

```txt
M&A preparado para venta enterprise mas seria.
```

### Sprint 2: data room y pipeline real

1. Drag and drop pipeline.
2. Watermark/descarga controlada.
3. Report export service compartido.
4. Admin console de tenants/usuarios.
5. Billing/licensing.

Resultado esperado:

```txt
M&A evoluciona de piloto privado a plataforma operacional.
```

## Criterio final de cerrado

M&A queda cerrado para venta enterprise privada cuando:

- build/unit/integration/e2e pasan;
- las 8 rutas renderizan y son navegables;
- hay 3 casos demo enterprise;
- export PDF/CIM existe con disclaimer y evidence pack;
- secure sharing backend existe con expiracion, revocacion, organizacion y audit trail;
- no hay fallback local en produccion;
- multi-tenancy y permisos gobiernan las acciones criticas;
- el alcance comercial esta documentado.

Estado al 07/05/2026:

```txt
Criterio de venta enterprise privada cumplido.
Producto M&A vendible como piloto controlado de 3.000 EUR por caso.
SaaS enterprise foundation v1 implementado.
Fase 4 certified-ready tecnica implementada.
Pendiente solo para certificacion formal externa: legal/SLA, billing, auditoria externa y QA en entorno productivo real.
```

## Punto de arranque para la siguiente sesion

Empezar por:

```txt
1. preparar legal/SLA para revision externa
2. definir billing/licensing
3. ejecutar auditoria externa
4. probar backup/restore en entorno real
5. consolidar report export service compartido
```

No empezar por nuevas pantallas de marketing hasta cerrar estructura, migraciones, permisos y data room.
