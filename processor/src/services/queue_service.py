import redis
import json
import os
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging

class QueueManager:
    def __init__(self):
        # Charger les variables d'environnement
        load_dotenv()
        
        # Configuration Redis depuis les variables d'environnement
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            password=os.getenv('REDIS_PASSWORD', None),
            db=int(os.getenv('REDIS_DB', 0)),
            decode_responses=True  # Automatiquement décoder les réponses en str
        )
        
        # Clés Redis
        self.queue_key = 'image_processing_queue'
        self.processing_key = 'currently_processing'
        
        # Vérifier la connexion
        try:
            self.redis_client.ping()
        except redis.ConnectionError as e:
            raise Exception(f"Failed to connect to Redis: {str(e)}")

    def add_to_queue(self, image_path: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """Ajoute une image à la file d'attente de traitement"""
        try:
            task_id = f"task_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{os.path.basename(image_path)}"
            task_data = {
                'id': task_id,
                'image_path': image_path,
                'status': 'queued',
                'metadata': metadata or {},
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            self.redis_client.hset(
                self.queue_key,
                task_id,
                json.dumps(task_data)
            )
            return task_id
        except Exception as e:
            raise Exception(f"Failed to add task to queue: {str(e)}")

    def get_next_task(self) -> Optional[Dict[str, Any]]:
        """Récupère la prochaine tâche à traiter"""
        try:
            all_tasks = self.redis_client.hgetall(self.queue_key)
            for task_id, task_data in all_tasks.items():
                task = json.loads(task_data)
                if task['status'] == 'queued':
                    return {'task_id': task_id, **task}
            return None
        except Exception as e:
            raise Exception(f"Failed to get next task: {str(e)}")

    def update_task_status(self, task_id: str, status: str, error_message: str = None) -> None:
        try:
            logging.info(f"🔄 Updating task {task_id} status to: {status}")
            
            task_data = self.redis_client.hget(self.queue_key, task_id)
            if not task_data:
                logging.error(f"❌ Task {task_id} not found in queue")
                return
                
            task = json.loads(task_data)
            task['status'] = status
            task['updated_at'] = datetime.now().isoformat()
            
            if error_message:
                task['error'] = error_message
                logging.error(f"⚠️ Task error: {error_message}")
                
            self.redis_client.hset(
                self.queue_key,
                task_id,
                json.dumps(task)
            )
            
            # Publier la mise à jour sur le canal Redis
            logging.info(f"📤 Publishing update to Redis channel")
            self.redis_client.publish('image-processing-updates', json.dumps(task))
            logging.info(f"✅ Status update complete for task {task_id}")
            
        except Exception as e:
            logging.error(f"❌ Failed to update task status: {str(e)}")
            raise

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Récupère le statut d'une tâche spécifique"""
        try:
            task_data = self.redis_client.hget(self.queue_key, task_id)
            return json.loads(task_data) if task_data else None
        except Exception as e:
            raise Exception(f"Failed to get task status: {str(e)}")

    def cleanup_old_tasks(self, max_age_hours: int = 24) -> int:
        """Nettoie les tâches anciennes"""
        try:
            all_tasks = self.redis_client.hgetall(self.queue_key)
            cleaned = 0
            
            for task_id, task_data in all_tasks.items():
                task = json.loads(task_data)
                created_at = datetime.fromisoformat(task['created_at'])
                
                if datetime.now() - created_at > timedelta(hours=max_age_hours):
                    self.redis_client.hdel(self.queue_key, task_id)
                    cleaned += 1
                    
            return cleaned
        except Exception as e:
            raise Exception(f"Failed to cleanup old tasks: {str(e)}")

    def get_queue_stats(self) -> Dict[str, int]:
        """Récupère les statistiques de la file d'attente"""
        try:
            all_tasks = self.redis_client.hgetall(self.queue_key)
            stats = {
                'total': 0,
                'queued': 0,
                'processing': 0,
                'completed': 0,
                'failed': 0
            }
            
            for task_data in all_tasks.values():
                task = json.loads(task_data)
                stats['total'] += 1
                stats[task['status']] = stats.get(task['status'], 0) + 1
                
            return stats
        except Exception as e:
            raise Exception(f"Failed to get queue stats: {str(e)}")

    def clear_queue(self) -> int:
        """Vide complètement la file d'attente"""
        try:
            count = len(self.redis_client.hkeys(self.queue_key))
            self.redis_client.delete(self.queue_key)
            return count
        except Exception as e:
            raise Exception(f"Failed to clear queue: {str(e)}")
