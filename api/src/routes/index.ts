import { Router } from 'express';
import { ConfigController } from '../controllers/config';
import { ImagesController } from '../controllers/images';
import { QueueController } from '../controllers/queue';

const router = Router();

router.post('/config/watch-folder', ConfigController.setWatchFolder);
router.get('/config', ConfigController.getConfig);
router.get('/status', ConfigController.getStatus);

router.get('/queue', QueueController.getQueue);
router.get('/queue/:taskId', QueueController.getTaskStatus);
router.delete('/queue/:taskId', QueueController.removeTask);
router.post('/queue/clear', QueueController.clearQueue);

router.get('/images/:id', ImagesController.getImage);
router.get('/images', ImagesController.listImages);

export default router;
