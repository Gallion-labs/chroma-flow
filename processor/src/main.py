import os
import time
import logging
from dotenv import load_dotenv
import yaml
from pathlib import Path
from services.printer_service import PrintManager
from services.queue_service import QueueManager
from services.watcher_service import FolderWatcher
from background.processor import ImageProcessor

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def setup_environment():
    """Configure l'environnement et retourne le chemin du dossier à surveiller"""
    # Obtenir le chemin absolu du projet
    project_dir = Path(__file__).parents[2]
    
    # Définir les chemins des dossiers
    watch_folder = project_dir / "data" / "images_to_process"
    output_folder = project_dir / "data" / "processed_images"
    temp_folder = project_dir / "data" / "temp"
    
    # Créer les dossiers s'ils n'existent pas
    watch_folder.mkdir(parents=True, exist_ok=True)
    output_folder.mkdir(parents=True, exist_ok=True)
    temp_folder.mkdir(parents=True, exist_ok=True)
    
    logging.info(f"Project directory: {project_dir}")
    logging.info(f"Watch folder set to: {watch_folder}")
    logging.info(f"Output folder set to: {output_folder}")
    logging.info(f"Temp folder set to: {temp_folder}")
    
    return str(watch_folder)

class ProcessorService:
    def __init__(self):
        logging.info("Initializing ProcessorService")
        self.watch_folder = setup_environment()
        self.config = self.load_config()
        self.queue_manager = QueueManager()
        self.print_manager = PrintManager()
        self.image_processor = ImageProcessor()
        
        # Initialiser et démarrer le watcher
        self.watcher = FolderWatcher(
            self.watch_folder,
            self.process_new_image
        )
        self.watcher.start()
        
        logging.info("ProcessorService initialized")

    def load_config(self):
        try:
            config_path = os.path.join(os.path.dirname(__file__), '../config.yml')
            with open(config_path, 'r') as file:
                config = yaml.safe_load(file)
                logging.info(f"Configuration loaded from: {config_path}")
                return config
        except Exception as e:
            logging.error(f"Failed to load config: {str(e)}")
            raise

    def process_new_image(self, image_path: str):
        """Callback appelé quand une nouvelle image est détectée"""
        try:
            logging.info(f"Processing new image: {image_path}")
            
            # Créer le chemin de sortie
            filename = os.path.basename(image_path)
            output_path = os.path.join(
                str(Path(self.watch_folder).parent / "processed_images"),
                f"processed_{filename}"
            )
            
            logging.info(f"Original filename: {filename}")
            logging.info(f"Output path: {output_path}")
            
            # Ajouter l'image à la file d'attente
            task_id = self.queue_manager.add_to_queue(image_path)
            logging.info(f"Added to queue with task_id: {task_id}")
            
            # Mettre à jour le statut
            self.queue_manager.update_task_status(task_id, 'processing')
            
            # Traiter l'image
            try:
                processed_path = self.image_processor.process(image_path, output_path)
                logging.info(f"Image processed and saved to: {processed_path}")
                self.queue_manager.update_task_status(task_id, 'completed')
                logging.info(f"Successfully processed: {image_path}")
            except Exception as e:
                self.queue_manager.update_task_status(task_id, 'failed', str(e))
                logging.error(f"Failed to process image: {str(e)}")
                raise
                
        except Exception as e:
            logging.error(f"Error in process_new_image: {str(e)}")
            if 'task_id' in locals():
                self.queue_manager.update_task_status(task_id, 'failed', str(e))

    def start(self):
        try:
            logging.info("Starting processor service...")
            # Maintenir le service en cours d'exécution
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                logging.info("Stopping service...")
                self.watcher.stop()
        except Exception as e:
            logging.error(f"Error starting processor: {str(e)}")
            raise

def main():
    try:
        service = ProcessorService()
        service.start()
    except Exception as e:
        logging.error(f"Fatal error: {str(e)}")
        raise

if __name__ == "__main__":
    main() 