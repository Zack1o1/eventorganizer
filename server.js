import express from 'express';
import { configDotenv } from 'dotenv';
import authRoutes from './routes/auth.js';
import verifyToken from './middleware/verifyToken.js';
import eventsRoutes from './routes/events.js';
import logger from './middleware/methodlogger.js';
import cors from 'cors'

configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(logger); 
app.use(express.json());

app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

// Base URI
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Local Event Organizer API');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/event', verifyToken, eventsRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
