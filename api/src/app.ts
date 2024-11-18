import express from 'express';
import http from 'http';
import cors from 'cors';
import { config } from 'dotenv';
import routes from './routes';
import { SocketService } from './services/socket.service';
import printRoutes from './routes/print.routes';

config();

const app = express();
const server = http.createServer(app);
const socketService = SocketService.getInstance();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);
app.use('/api', printRoutes);

// Socket.IO initialization
socketService.initialize(server);

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  socketService.cleanup();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
