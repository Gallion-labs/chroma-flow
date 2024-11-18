import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { RouteHandler } from '../types/controller.types';

export class ConfigController {
  private static configPath = path.join(__dirname, '../../config.json');

  static getConfig: RouteHandler = async (req: Request, res: Response) => {
    try {
      const config = await fs.promises.readFile(ConfigController.configPath, 'utf8');
      return res.json(JSON.parse(config));
    } catch (error) {
      return res.status(500).json({ error: 'Failed to read configuration' });
    }
  };

  static setWatchFolder: RouteHandler = async (req: Request, res: Response) => {
    try {
      const { folderPath } = req.body;
      
      if (!folderPath) {
        return res.status(400).json({ error: 'Folder path is required' });
      }

      const config = {
        watchFolder: folderPath,
        lastUpdated: new Date().toISOString()
      };

      await fs.promises.writeFile(
        ConfigController.configPath,
        JSON.stringify(config, null, 2)
      );

      return res.json(config);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update configuration' });
    }
  };

  static getStatus: RouteHandler = async (req: Request, res: Response) => {
    return res.json({ status: 'operational' });
  };
}
