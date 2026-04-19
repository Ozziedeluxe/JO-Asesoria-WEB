# Workflow: Trabaja con nosotros → Google Sheet + Drive

## Objetivo
Cada vez que alguien llena el formulario "Trabaja con nosotros" en la web de JO Asesores, sus datos se guardan automáticamente en un Google Sheet y su CV se sube a una carpeta de Google Drive.

## Arquitectura
```
Formulario web → fetch() POST → Google Apps Script (web app)
                                    ├── Google Sheet: "JO Asesores — Trabaja con nosotros"
                                    └── Google Drive: carpeta "JO Asesores — CVs"
```

## Datos capturados
| Campo | Descripción |
|-------|-------------|
| Fecha | Timestamp automático |
| Nombre | Nombre completo del postulante |
| Email | Correo electrónico |
| WhatsApp | Número de teléfono |
| Especialidad | Área o especialidad |
| Link CV (Drive) | URL directa al CV en Drive |
| Archivo CV | Nombre del archivo subido |

---

## PASO 1 — Deploy del Apps Script (solo se hace una vez)

1. Ir a [script.google.com](https://script.google.com) con la cuenta de Google de JO Asesores
2. Clic en **"+ Nuevo proyecto"**
3. Borrar el contenido por defecto
4. Pegar el contenido completo de `tools/apps_script/jobs_form_handler.gs`
5. Ponerle nombre al proyecto: `JO Asesores — Jobs Form Handler`
6. Clic en **"Implementar"** → **"Nueva implementación"**
   - Tipo: **Aplicación web**
   - Descripción: `v1`
   - Ejecutar como: **Yo** (tu cuenta de Google)
   - Quién tiene acceso: **Cualquier usuario** (Anyone)
7. Clic en **"Implementar"** → Autorizar permisos cuando lo pida
8. Copiar la URL que aparece (empieza con `https://script.google.com/macros/s/...`)

---

## PASO 2 — Conectar la URL al formulario web

Abrir `index.html` y buscar esta línea (~línea 1554):

```javascript
const APPS_SCRIPT_URL = 'REEMPLAZAR_CON_URL_DE_APPS_SCRIPT';
```

Reemplazar el valor con la URL copiada en el Paso 1:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/TU_ID_AQUI/exec';
```

---

## PASO 3 — Verificar que funciona

1. Abrir la web en un navegador
2. Ir a la sección "Trabaja con nosotros"
3. Llenar el formulario con datos de prueba y subir un PDF
4. Verificar en Google Drive que:
   - Aparece la carpeta **"JO Asesores — CVs"** con el archivo subido
   - Aparece el spreadsheet **"JO Asesores — Trabaja con nosotros"** con la fila registrada

---

## Comportamiento del formulario

El formulario hace **dos cosas en paralelo**:
1. **Guarda en Google Sheet** + sube el CV a Drive (silencioso, en background)
2. **Abre WhatsApp** con los datos pre-llenados (comportamiento original)

Si el Apps Script falla (error de red, etc.), el formulario igual abre WhatsApp. No se pierde la postulación.

---

## Re-deploy (cuando hay cambios en el script)

Si modificas `jobs_form_handler.gs`:
1. En el editor de Apps Script: **Implementar** → **Administrar implementaciones**
2. Editar la implementación existente → Nueva versión
3. La URL no cambia, no hace falta actualizar el HTML

---

## Archivos relevantes
- `tools/apps_script/jobs_form_handler.gs` — Backend del formulario
- `index.html` línea ~1554 — Variable `APPS_SCRIPT_URL`
