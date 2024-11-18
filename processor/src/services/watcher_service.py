import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os
from typing import Callable
import logging

class ImageHandler(FileSystemEventHandler):
    def __init__(self, callback: Callable[[str], None], allowed_extensions=('.jpg', '.jpeg', '.png')):
        self.callback = callback
        self.allowed_extensions = allowed_extensions
        self.processed_files = set()
        logging.info(f"ImageHandler initialized with extensions: {allowed_extensions}")

    def on_created(self, event):
        logging.info(f"File event detected: {event.src_path}")
        
        if event.is_directory:
            logging.info(f"Skipping directory: {event.src_path}")
            return

        if any(event.src_path.lower().endswith(ext) for ext in self.allowed_extensions):
            logging.info(f"Valid image detected: {event.src_path}")
            
            # Attendre que le fichier soit complètement écrit
            time.sleep(1)
            
            if not os.path.exists(event.src_path):
                logging.warning(f"File disappeared: {event.src_path}")
                return
                
            if event.src_path not in self.processed_files:
                self.processed_files.add(event.src_path)
                logging.info(f"Processing new file: {event.src_path}")
                self.callback(event.src_path)
            else:
                logging.info(f"File already processed: {event.src_path}")
        else:
            logging.info(f"Skipping non-image file: {event.src_path}")

    def on_modified(self, event):
        logging.info(f"File modified: {event.src_path}")
        self.on_created(event)

class FolderWatcher:
    def __init__(self, watch_folder: str, callback: Callable[[str], None]):
        self.watch_folder = os.path.abspath(watch_folder)
        self.observer = Observer()
        self.handler = ImageHandler(callback)
        logging.info(f"FolderWatcher initialized for: {self.watch_folder}")
        
        # Vérifier que le dossier existe
        if not os.path.exists(self.watch_folder):
            logging.error(f"Watch folder does not exist: {self.watch_folder}")
            raise Exception(f"Watch folder does not exist: {self.watch_folder}")
            
        # Vérifier les permissions
        if not os.access(self.watch_folder, os.R_OK | os.W_OK):
            logging.error(f"Insufficient permissions for folder: {self.watch_folder}")
            raise Exception(f"Insufficient permissions for folder: {self.watch_folder}")

    def start(self):
        """Démarre la surveillance du dossier"""
        try:
            self.observer.schedule(self.handler, self.watch_folder, recursive=False)
            self.observer.start()
            logging.info(f"Started watching folder: {self.watch_folder}")
            
            # Traiter les fichiers existants
            existing_files = [f for f in os.listdir(self.watch_folder) 
                            if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if existing_files:
                logging.info(f"Found existing files: {existing_files}")
                for filename in existing_files:
                    filepath = os.path.join(self.watch_folder, filename)
                    self.handler.on_created(type('Event', (), {'is_directory': False, 'src_path': filepath})())
            
        except Exception as e:
            logging.error(f"Error starting watcher: {e}")
            raise

    def stop(self):
        """Arrête la surveillance du dossier"""
        self.observer.stop()
        self.observer.join()