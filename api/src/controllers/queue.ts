import { Request, Response } from 'express';
import Redis from 'ioredis';
import { RouteHandler } from '../types/controller.types';

// Initialisation de Redis avec la configuration depuis l'environnement
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Gestion des erreurs de connexion Redis
redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export class QueueController {
  static getQueue: RouteHandler = async (req: Request, res: Response) => {
    try {
      const tasks = await redis.hgetall('image_processing_queue');
      const formattedTasks = Object.entries(tasks).map(([taskId, data]) => {
        const taskData = JSON.parse(data);
        return {
          id: taskData.id || taskId,
          ...taskData
        };
      });
      return res.json(formattedTasks);
    } catch (error) {
      console.error('Get queue error:', error);
      return res.status(500).json({ error: 'Failed to get queue' });
    }
  };

  static getTaskStatus: RouteHandler = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await redis.hget('image_processing_queue', taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.json(JSON.parse(task));
    } catch (error) {
      console.error('Get task status error:', error);
      return res.status(500).json({ error: 'Failed to get task status' });
    }
  };

  static removeTask: RouteHandler = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const result = await redis.hdel('image_processing_queue', taskId);
      
      if (result === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.json({ message: 'Task removed successfully' });
    } catch (error) {
      console.error('Remove task error:', error);
      return res.status(500).json({ error: 'Failed to remove task' });
    }
  };

  static clearQueue: RouteHandler = async (req: Request, res: Response) => {
    try {
      const tasks = await redis.hkeys('image_processing_queue');
      if (tasks.length > 0) {
        await redis.hdel('image_processing_queue', ...tasks);
      }
      return res.json({ message: 'Queue cleared successfully' });
    } catch (error) {
      console.error('Clear queue error:', error);
      return res.status(500).json({ error: 'Failed to clear queue' });
    }
  };
}