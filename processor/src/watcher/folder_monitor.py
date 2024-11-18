from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os

class ImageFolderMonitor:
    def __init__(self, watch_folder, queue_manager, logger):
        self.watch_folder = watch_folder
        self.queue_manager = queue_manager
        self.logger = logger
        self.observer = Observer()

    def start(self):
        event_handler = ImageHandler(self.queue_manager, self.logger)
        self.observer.schedule(event_handler, self.watch_folder, recursive=False)
        self.observer.start()
        self.logger.info(f"Started monitoring folder: {self.watch_folder}")

class ImageHandler(FileSystemEventHandler):
    def __init__(self, queue_manager, logger):
        self.queue_manager = queue_manager
        self.logger = logger

    def on_created(self, event):
        if event.is_directory:
            return

        if event.src_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            self.logger.info(f"New image detected: {event.src_path}")
            self.queue_manager.add_to_queue(event.src_path) 