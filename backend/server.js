import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import organizerRoutes from './routes/organizer.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import eventRoutes from './routes/event.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './config/socket.config.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('Welcome to the Event Management API');
});
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/tickets', ticketRoutes);

const httpServer = createServer (app);
initSocket (httpServer);

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log("JWT secret at startup:", process.env.JWT_SECRET);
});