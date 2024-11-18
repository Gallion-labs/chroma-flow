import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export class ImagesController {
  static async getImage(req: Request, res: Response) {
    try {
      let { id, type } = req.params;
      // Get type from query params if not provided in the url
      type = req.query.type as string || type;
      console.log('🔍 Getting image with id:', id, 'and type:', type);
      
      const projectRoot = path.resolve(__dirname, '../../../');
      
      let imagePath;
      if (type === 'original') {
        imagePath = path.join(projectRoot, 'data/images_to_process', id);
      } else {
        const filename = id.startsWith('processed_') ? id : `processed_${id}`;
        imagePath = path.join(projectRoot, 'data/processed_images', filename);
      }

      console.log('Trying to access image:', imagePath);

      if (!fs.existsSync(imagePath)) {
        console.error(`Image not found: ${imagePath}`);
        return res.status(404).json({ error: 'Image not found' });
      }

      res.sendFile(imagePath);
    } catch (error) {
      console.error('Get image error:', error);
      res.status(500).json({ error: 'Failed to get image' });
    }
  }

  static async listImages(req: Request, res: Response) {
    try {
      const projectRoot = path.resolve(__dirname, '../../../');
      const imagesDir = path.join(projectRoot, 'data/processed_images');
      
      if (!fs.existsSync(imagesDir)) {
        return res.status(404).json({ error: 'Images directory not found' });
      }

      const files = fs.readdirSync(imagesDir);
      res.json({ files });
    } catch (error) {
      console.error('List images error:', error);
      res.status(500).json({ error: 'Failed to list images' });
    }
  }
}