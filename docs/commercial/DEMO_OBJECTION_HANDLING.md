# Demo Objection Handling — CEO's OS

**Use with:** `WHAT_WE_CAN_AND_CANNOT_SAY.md` · `BOARD_INTELLIGENCE_PILOT_OFFER.md`  
**Tone:** Honest DSS · human review · controlled pilot

---

## 1. “¿Esto es solo ChatGPT con un dashboard?”

**Respuesta:** No. CEO's OS es un **workspace privado multi-módulo** (M&A, Compliance, Funding, Reporting, etc.) con **fuente de verdad por módulo**, **snapshots persistidos**, **workflow con gates humanos** y **metadatos de auditoría**. La IA, cuando se active, será un **asistente de borrador** sobre señales DSS ya existentes — no un chat genérico que inventa cifras.

**No decir:** “Es como ChatGPT pero mejor” o “la IA lo resuelve todo”.

---

## 2. “¿La IA toma decisiones?”

**Respuesta:** **No.** Es **decision support**, no **autonomous decision-making**. Cualquier narrativa de IA es **AI Draft · Requires Human Review**. La IA no aprueba estados `reviewed` / `internal_final`, no certifica y no recalcula scores oficiales.

---

## 3. “¿Esto sustituye a asesores legales o financieros?”

**Respuesta:** **No.** No es asesoramiento legal ni de inversión. Prepara **Board Review Drafts** y señales operativas para que **personas cualificadas** decidan. Escala la preparación y la trazabilidad, no el juicio profesional regulado.

---

## 4. “¿Está certificado (SOC2, ISO, compliance)?”

**Respuesta:** **No** vendemos certificación enterprise, SOC2, ISO ni compliance certificado. Tenemos **procedimientos de piloto** documentados (auth, auditoría en rutas clave, backup, tenant isolation en scope). La hoja de ruta de procurement es **futura** y requiere programa formal.

---

## 5. “¿Qué pasa con datos sensibles?”

**Respuesta:** Piloto **controlado**: tenant aislado, datos mínimos bajo NDA, sin pegar secretos en tickets. Snapshots y auditoría con **redacción** de campos sensibles en diseño. Antes de enviar datos a un proveedor LLM externo hará falta **DPA/subprocessor** — hoy el producto **no** vende envío masivo a IA en runtime sin ese gate.

---

## 6. “¿Se puede usar para el consejo de administración?”

**Respuesta:** **Sí, como material de preparación** — **Board Review Draft**, **Human Review Required**, **Not Board Approved**. El consejo sigue siendo la autoridad; el producto no emite “aprobado por el board”.

---

## 7. “¿Qué diferencia hay frente a Power BI / Notion / ChatGPT?”

**Respuesta:**  
- vs **BI:** CEO's OS une **narrativa ejecutiva + workflow de board pack + snapshots auditables**, no solo gráficos.  
- vs **Notion:** **SoT por módulo**, permisos multi-tenant, workflow `draft/reviewed/internal_final`, no wiki genérico.  
- vs **ChatGPT:** contexto **acotado al tenant y al snapshot**, sin inventar KPIs; human gates obligatorios.

---

## 8. “¿Qué pasa si faltan datos?”

**Respuesta:** Mostramos **`insufficient_data` / N/A** — no convertimos ausencia en **0** o “watch” falso (post P2-FIX-02 en Compliance/Executive). La demo debe enseñar honestidad de datos, no scores sintéticos.

---

## 9. “¿Qué entregáis al final del piloto?”

**Respuesta:** Snapshots persistidos exportables en preview HTML, registro de workflow, retrospectiva contra criterios de éxito, recomendación expand/hold. **No** entregamos PDF certificado ni dictamen legal/inversión.

---

## 10. “¿Cuánto cuesta?”

**Respuesta:** Rangos orientativos en `BOARD_INTELLIGENCE_PILOT_OFFER.md` (3k–25k EUR según paquete). Precio final por alcance escrito. Sin success fee ni marketplace público en esta oferta.

---

## 11. “¿Puede conectarse a mis sistemas?”

**Respuesta:** Piloto estándar: **carga controlada** (CSV/API futuro por fase). Integraciones profundas ERP/BI son **proyecto aparte**, no prometidas en demo base.

---

## 12. “¿Qué riesgos tiene?”

**Respuesta:**  
- **Producto:** malinterpretar borrador como aprobado → mitigado con labels y formación.  
- **Datos:** exceso de PII en piloto → mitigado con intake mínimo y NDA.  
- **Ops:** smoke autenticado en prod puede estar **P2** hasta credenciales en secret store — ejecutar checklist antes de demo externa crítica.  
- **IA futura:** prompt injection / subprocessor → diseñado en C.16.0, no runtime abierto sin DPA.

**Cierre:** “El valor es **contexto privado, workflow, auditoría y revisión humana** — no certificación ni autonomía.”

---

## 13. "Where is the real AI?"

**Respuesta:** The AI layer is intentionally staged. The current product has an **AI-ready Board Review Draft Assistant foundation** with provider abstraction, prompt registry, guardrails, and mock/disabled runtime. It is not yet sold as production LLM traffic. Before customer data goes to an external provider, we need DPA/subprocessor review and an authorized runtime phase.

**No decir:** "OpenAI is already drafting your board packs in production" or "AI approves the report."

---

## 14. "Why pay for a pilot instead of waiting?"

**Respuesta:** The pilot is not just access to software. It tests whether the customer's real board-prep workflow benefits from private DSS context, persisted snapshots, human review gates, and audit metadata. The deliverable is a scoped operating loop: selected data, Board Review Drafts, reviewer workflow, success criteria, and an expand/hold decision.

**No decir:** "The pilot buys a certified enterprise deployment" or "the pilot guarantees board approval."
