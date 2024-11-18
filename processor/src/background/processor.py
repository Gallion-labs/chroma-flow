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
        
        # Charger toutes les scènes disponibles
        self.scenes = [str(f) for f in self.scenes_folder.glob("*.jp*g")]
        if not self.scenes:
            raise Exception("No scene files found in scenes folder")
        logging.info(f"Found {len(self.scenes)} scene(s)")

    def remove_background(self, input_path: str) -> Image.Image:
        """Supprime le fond vert et retourne l'image sans fond"""
        try:
            # Lire l'image avec Pillow
            input_image = Image.open(input_path)
            
            # Convertir en bytes pour rembg
            input_bytes = io.BytesIO()
            input_image.save(input_bytes, format='PNG')
            input_bytes = input_bytes.getvalue()
            
            # Supprimer le fond
            output_bytes = remove(input_bytes, alpha_matting=True)
            
            # Reconvertir en image Pillow (avec canal alpha)
            return Image.open(io.BytesIO(output_bytes)).convert('RGBA')
            
        except Exception as e:
            logging.error(f"Failed to remove background: {str(e)}")
            raise

    def process_all_scenes(self, input_path: str, output_dir: str) -> list[str]:
        processed_paths = []
        
        try:
            # Supprimer le fond une seule fois
            logging.info("Removing background...")
            foreground = self.remove_background(input_path)
            logging.info("Background removed successfully")
            
            # Appliquer chaque scène
            for i, scene_path in enumerate(self.scenes):
                output_filename = f"processed_{i+1}_{os.path.basename(input_path)}"
                output_path = os.path.join(output_dir, output_filename)
                
                try:
                    self.apply_background(foreground, scene_path, output_path)
                    processed_paths.append(output_path)
                except Exception as e:
                    logging.error(f"Failed to process scene {scene_path}: {str(e)}")
                    
            return processed_paths
            
        except Exception as e:
            logging.error(f"Failed to process image: {str(e)}")
            raise

    def apply_background(self, foreground: Image.Image, scene_path: str, output_path: str) -> str:
        """Applique un fond à l'image sans fond"""
        try:
            # Créer le dossier de sortie s'il n'existe pas
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Charger et préparer l'image de fond
            background = Image.open(scene_path).convert('RGBA')
            background = background.resize(foreground.size, Image.Resampling.LANCZOS)
            
            # Créer une nouvelle image pour le résultat
            composite = Image.new('RGBA', foreground.size, (0, 0, 0, 0))
            composite.paste(background, (0, 0))
            composite.paste(foreground, (0, 0), foreground)
            
            # Convertir en RGB avant de sauvegarder
            composite = composite.convert('RGB')
            composite.save(output_path, 'JPEG', quality=95)
            
            return output_path
            
        except Exception as e:
            logging.error(f"Failed to apply background: {str(e)}")
            raise