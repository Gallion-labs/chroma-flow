import { Router } from 'express';
import { QueueController } from '../controllers/queue';

const router = Router();

router.get('/queue', QueueController.getQueue);
router.get('/queue/:taskId', QueueController.getTaskStatus);
router.delete('/queue/:taskId', QueueController.removeTask);
router.post('/queue/clear', QueueController.clearQueue);

export default router;