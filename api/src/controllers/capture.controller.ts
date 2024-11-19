import { Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export class CaptureController {
  static async saveCapture(req: Request, res: Response) {
    try {
      const { image } = req.body;
      
      // Enlever le préfixe data:image/jpeg;base64,
      const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
      
      // Créer un nom de fichier unique
      const filename = `capture_${uuidv4()}.jpg`;
      const filepath = join(process.env.WATCH_FOLDER || '../data/images_to_process', filename);
      
      // Sauvegarder l'image
      await writeFile(filepath, base64Data, 'base64');
      
      res.json({ success: true, filename });
    } catch (error) {
      console.error('Capture error:', error);
      res.status(500).json({ error: 'Failed to save capture' });
    }
  }
}