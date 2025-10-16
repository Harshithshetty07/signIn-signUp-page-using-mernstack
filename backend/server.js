const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route FIRST
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Import after middleware setup
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('✅ MongoDB connected successfully');

        // Register routes AFTER database connection
        app.use('/api/auth', authRoutes);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
            console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
            console.log(`✅ Ready to accept requests`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    process.exit(1);
});

startServer();