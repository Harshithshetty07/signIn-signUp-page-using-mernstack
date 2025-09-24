const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// importing Mongodb Connection 
const connectDB = require('./config/db');

// Importing Authentication Routes
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use('api/auth', authRoutes);

// Api health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`)
})