from PIL import Image
from rembg import remove
import io
import os
import logging
from pathlib import Path

class ImageProcessor:
    def __init__(self):
        self.scenes_folder = Path(__file__).parents[3] / "data" / "scenes"
        if not self.scenes_folder.exists():
            raise Exception(f"Scenes folder not found: {self.scenes_folder}")
        self.background_image = str(self.scenes_folder / "1.jpeg")
        if not os.path.exists(self.background_image):
            raise Exception(f"Default background image not found: {self.background_image}")
        logging.info(f"Background image path: {self.background_image}")

    def process(self, input_path: str, output_path: str) -> str:
        try:
            logging.info(f"Starting image processing: {input_path}")
            
            # Créer le dossier de sortie s'il n'existe pas
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Lire l'image avec Pillow
            input_image = Image.open(input_path)
            
            # Convertir en bytes pour rembg
            input_bytes = io.BytesIO()
            input_image.save(input_bytes, format='PNG')
            input_bytes = input_bytes.getvalue()
            
            # Supprimer le fond
            output_bytes = remove(input_bytes)
            
            # Reconvertir en image Pillow (avec canal alpha)
            foreground = Image.open(io.BytesIO(output_bytes)).convert('RGBA')
            logging.info(f"Foreground size: {foreground.size}, mode: {foreground.mode}")
            
            # Charger et préparer l'image de fond
            background = Image.open(self.background_image).convert('RGBA')
            logging.info(f"Original background size: {background.size}, mode: {background.mode}")
            
            # Redimensionner le fond pour correspondre aux dimensions de l'image d'entrée
            background = background.resize(foreground.size, Image.Resampling.LANCZOS)
            logging.info(f"Resized background size: {background.size}")
            
            # Créer une nouvelle image pour le résultat
            composite = Image.new('RGBA', foreground.size, (0, 0, 0, 0))
            
            # Coller d'abord le fond
            composite.paste(background, (0, 0))
            
            # Puis coller le premier plan avec son masque alpha
            composite.paste(foreground, (0, 0), foreground)
            
            # Convertir en RGB avant de sauvegarder (enlever la transparence)
            composite = composite.convert('RGB')
            
            # Sauvegarder
            composite.save(output_path, 'JPEG', quality=95)
            
            logging.info(f"Image processed and saved to: {output_path}")
            return output_path
            
        except Exception as e:
            logging.error(f"Failed to process image: {str(e)}")
            raise Exception(f"Failed to process image: {str(e)}") 