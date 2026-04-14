# Workflow: Generar imágenes para la web con Gemini

## Objetivo
Crear imágenes profesionales para la web de JO Asesores usando la API de Gemini (Imagen 3).

## Herramienta
`tools/generate_image.py`

## Pre-requisitos
1. **API Key de Gemini** configurada en `.env`:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```
   Obtén tu clave gratis en: https://aistudio.google.com/apikey

2. **Dependencias Python instaladas**:
   ```
   pip install google-genai python-dotenv
   ```

## Cómo usar

### Forma básica
```bash
python tools/generate_image.py "descripción de la imagen"
```

### Con nombre de archivo específico
```bash
python tools/generate_image.py "prompt" --output brand_assets/nombre.png
```

### Con relación de aspecto
```bash
python tools/generate_image.py "prompt" --ratio 1:1 --output brand_assets/perfil.png
```

## Relaciones de aspecto disponibles
| Ratio | Uso recomendado |
|-------|-----------------|
| 16:9  | Banners, hero sections (default) |
| 1:1   | Cards cuadradas, testimonios |
| 3:4   | Fotos de perfil, móvil |
| 4:3   | Secciones interiores |
| 9:16  | Stories, vertical |

## Prompts sugeridos para JO Asesores

### Hero / Banner principal
```
estudiante universitario peruano joven celebrando con diploma en campus universitario moderno, 
luz natural cálida, expresión de logro y alegría, fondo de biblioteca académica, 
estilo fotográfico profesional, tonos dorados y blancos
```

### Sección de servicios
```
asesor académico adulto mayor explicando metodología de investigación a estudiante universitario, 
ambiente de oficina profesional Lima Perú, luz natural, tonos corporativos dorados
```

### Proceso de trabajo
```
laptop con documentos académicos y gráficos estadísticos en escritorio ordenado, 
libros de investigación científica, bolígrafo y notas, ambiente de estudio profesional, 
fotografía clean y minimalista
```

## Notas
- Las imágenes se guardan en `brand_assets/` por defecto
- Gemini Imagen 3 genera imágenes de alta calidad (hasta 1024x1024 en algunos ratios)
- Si el prompt viola filtros de seguridad, simplifica el lenguaje y reintenta
- Cuota gratuita: ~100 imágenes/día en el tier free de Google AI Studio
