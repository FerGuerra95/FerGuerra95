# Roles y Permisos

## Roles sugeridos
- **admin**: control total de la organización.
- **analyst**: análisis, edición y generación de reportes.
- **reviewer**: revisión y validación de hallazgos.
- **legal**: acceso ampliado a evidencia, comentarios y validación final.
- **client**: acceso limitado a lectura y descarga de informes.
- **read_only**: consulta sin edición.

## Permisos por módulo
### M&A
- Crear y editar casos
- Ejecutar análisis
- Guardar escenarios
- Exportar reportes
- Gestionar buyer matching

### Compliance
- Crear y editar proveedores
- Ver alertas y evidencia
- Emitir decisiones de revisión
- Generar reportes
- Gestionar configuraciones de escaneo

## Reglas
- Solo `admin` y `legal` pueden cerrar revisiones críticas.
- Solo `admin` puede modificar permisos.
- `client` no debe editar inputs ni decisiones.
- Acceso a evidencia sensible condicionado por organización y rol.
