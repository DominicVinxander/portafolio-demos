# Plan técnico — Sistema de Historias Clínicas (piloto)

Cliente: amigo odontólogo (piloto individual, sin agenda de citas).
Presupuesto: S/900–S/1,100 en 3 partes (40% inicio / 30% demo funcional / 30% entrega).

## Stack recomendado

- **Frontend:** Next.js (React) — despliegue gratis en Vercel, buen soporte de Claude Code.
- **Backend/DB/Auth/Storage:** Supabase (plan gratuito) — Postgres + autenticación + almacenamiento de archivos en un solo servicio, cero costo de hosting para el piloto.
- **Hosting:** Vercel (frontend) + Supabase (backend), ambos en tier gratuito.

Nota de diseño: aunque el piloto es para un solo odontólogo, el esquema de base de datos se diseña desde ahora con un campo `dentista_id` (o `clinica_id`) en cada tabla. Si sus colegas se suman después, no hace falta reescribir el modelo de datos — solo agregar filas y ajustar el login.

## Fase 0 — Setup (corresponde al 40% de inicio)

1. Crear repo (privado) y proyecto Next.js.
2. Crear proyecto en Supabase, guardar credenciales en variables de entorno (nunca en el código).
3. Definir esquema inicial en Postgres:
   - `dentistas` (id, email, nombre)
   - `pacientes` (id, dentista_id, nombre, dni/documento, fecha_nacimiento, teléfono, notas_generales)
   - `consultas` (id, paciente_id, fecha, motivo, notas del tratamiento)
   - `archivos` (id, consulta_id o paciente_id, tipo [foto/radiografía], ruta_storage, fecha_subida)
4. Activar Row Level Security (RLS) en todas las tablas desde el día uno — cada fila solo visible para su `dentista_id`. Esto es la base de la seguridad, no un extra de última hora.

## Fase 1 — Autenticación

1. Login con Supabase Auth (email/password), un solo usuario permitido (el amigo).
2. Todas las rutas de la app protegidas — sin sesión válida, no hay acceso a nada.
3. Sin registro público de nuevos usuarios (se crea manualmente en Supabase mientras sea piloto de un solo dentista).

## Fase 2 — Pacientes e historial (corresponde al 30% de "demo funcionando")

1. CRUD de pacientes: alta, edición, listado, búsqueda por nombre/documento.
2. Vista de detalle del paciente con línea de tiempo de consultas.
3. Registrar consulta: fecha, motivo, notas del tratamiento, asociada al paciente.
4. Esta es la versión que se presenta como demo funcional al amigo — pacientes + historial ya operativos, sin fotos todavía.

## Fase 3 — Fotos y radiografías + cierre de seguridad (corresponde al 30% de entrega)

1. Subida de imágenes a Supabase Storage en un **bucket privado** (no público) — acceso solo vía URLs firmadas y temporales, nunca URLs directas abiertas.
2. Asociar cada archivo subido a su consulta/paciente.
3. Visor simple de fotos/radiografías dentro del historial del paciente.
4. Revisión de seguridad antes de entregar:
   - Confirmar que RLS está activo y probado (intentar acceder a datos de otro `dentista_id` simulado y verificar que falla).
   - Confirmar que el bucket de storage no es público.
   - Backups: exportar la base de datos periódicamente (Supabase free tier no incluye point-in-time recovery automático — hay que hacerlo manual o programado).
   - Variables de entorno y llaves de Supabase fuera del repo (`.env` en `.gitignore`).
5. Deploy final en Vercel, dominio (puede ser subdominio gratuito de Vercel para el piloto).
6. Entrega + breve capacitación al amigo sobre cómo usar el sistema.

## Cómo usar este plan con Claude Code

Llevar este documento como brief inicial a la sesión de Claude Code. Sugerencia de orden de trabajo real: Fase 0 y 1 se pueden hacer juntas en la primera sesión (son la base técnica), luego Fase 2 es un bloque de trabajo independiente, y Fase 3 se aborda al final — es intencionalmente la última porque maneja los datos más sensibles (imágenes médicas) y por eso concentra la revisión de seguridad.
