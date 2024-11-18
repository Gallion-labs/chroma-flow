import { Router } from 'express';
import { PrintController } from '../controllers/print.controller';

const router = Router();

router.post('/print/:id', PrintController.printImage);

export default router;