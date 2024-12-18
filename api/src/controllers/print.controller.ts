import { Request, Response } from 'express';
import Redis from 'ioredis';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});

export class PrintController {
  static async printImage(req: Request, res: Response) {
    try {
      const taskId = req.params.id;
      const selectedVersion = parseInt(req.query.version as string) || 0;
      const taskData = await redis.hget('image_processing_queue', taskId);
      
      if (!taskData) {
        return res.status(404).json({ error: 'Image not found' });
      }

      const task = JSON.parse(taskData);
      
      if (task.status !== 'completed' && task.status !== 'printed') {
        return res.status(400).json({ 
          error: 'Image must be processed before printing' 
        });
      }

      if (!task.images || !task.images.length) {
        return res.status(400).json({ 
          error: 'No processed images available' 
        });
      }

      // Utiliser la version sélectionnée ou la première par défaut
      const processedPath = task.images[selectedVersion];

      // Vérifier que le fichier existe
      if (!fs.existsSync(processedPath)) {
        return res.status(404).json({ error: 'Processed image file not found' });
      }

      // Lancer la commande d'impression
      const printProcess = spawn('lpr', [
        '-P', process.env.DEFAULT_PRINTER || 'default',
        '-o', 'media=A4',
        '-o', 'fit-to-page=true',
        processedPath
      ]);

      printProcess.on('close', async (code) => {
        if (code === 0) {
          task.status = 'printed';
          task.updated_at = new Date().toISOString();
          await redis.hset('image_processing_queue', taskId, JSON.stringify(task));
          res.json({ success: true });
        } else {
          res.status(500).json({ error: 'Print command failed' });
        }
      });

      printProcess.on('error', (error) => {
        console.error('Print process error:', error);
        res.status(500).json({ 
          error: 'Failed to start print process',
          details: error.message
        });
      });
    } catch (error) {
      console.error('Print controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}