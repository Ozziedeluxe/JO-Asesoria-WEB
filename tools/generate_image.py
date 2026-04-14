"""
generate_image.py
-----------------
Genera imágenes para la web de JO Asesores usando la API de Gemini (Imagen 3).

Uso:
    python tools/generate_image.py "prompt descriptivo de la imagen" [--output nombre_archivo.png]

Ejemplo:
    python tools/generate_image.py "estudiante universitario peruano celebrando con su diploma, fondo universitario, estilo profesional moderno" --output hero_graduado.png
"""

import os
import sys
import argparse
import base64
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
    print("ERROR: Configura GEMINI_API_KEY en el archivo .env")
    print("Obtén tu clave en: https://aistudio.google.com/apikey")
    sys.exit(1)

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("ERROR: Instala el SDK con:  pip install google-genai")
    sys.exit(1)


def generate_image(prompt: str, output_path: str = None) -> str:
    """
    Genera una imagen a partir de un prompt usando Gemini Imagen 3.

    Args:
        prompt: Descripción de la imagen a generar.
        output_path: Ruta de salida (opcional). Si no se indica se guarda en brand_assets/.

    Returns:
        Ruta del archivo generado.
    """
    client = genai.Client(api_key=GEMINI_API_KEY)

    print(f"Generando imagen: {prompt[:80]}...")

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_bytes = part.inline_data.data
            break

    if image_bytes is None:
        print("ERROR: La API no devolvió imágenes. Revisa el prompt.")
        sys.exit(1)

    # Determinar nombre de archivo de salida
    if output_path is None:
        slug = "_".join(prompt.split()[:4]).lower()
        slug = "".join(c if c.isalnum() or c == "_" else "" for c in slug)
        output_path = f"brand_assets/{slug}.png"

    # Asegurar que el directorio existe
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # Guardar imagen
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    print(f"Imagen guardada en: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Genera imágenes para la web con Gemini Imagen 3")
    parser.add_argument("prompt", help="Descripción de la imagen a generar")
    parser.add_argument("--output", "-o", default=None, help="Ruta de salida (ej: brand_assets/banner.png)")
    parser.add_argument("--ratio", default="16:9",
                        choices=["1:1", "3:4", "4:3", "9:16", "16:9"],
                        help="Relación de aspecto (default: 16:9)")
    args = parser.parse_args()

    generate_image(args.prompt, args.output)


if __name__ == "__main__":
    main()
