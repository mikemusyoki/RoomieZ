require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const socketHandler = require('./sockets/chat');

// Routes
const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matches');
const profileRoutes = require('./routes/profiles');
const chatRoutes = require('./routes/chat');
const questionnaireRoutes = require('./routes/questionnaire');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/admin', adminRoutes);

// Initialize Chat Socket Logic
socketHandler(io);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'RoomieZ API 🚀', status: 'OK' });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      db: dbState
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;

    // If no external MongoDB, use in-memory server
    if (!mongoUri || mongoUri.includes('localhost:27017')) {
      console.log('🔄 Starting in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('✅ In-memory MongoDB started');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    server.listen(PORT, () => {
      console.log(`🚀 Server & Sockets running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();