const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/services', require('./routes/services'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/transactions', require('./routes/transactions'));
app.use('/admin', require('./routes/admin'));

// Error handler (add at the end)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Placeholder for routes (add later)
app.get('/', (req, res) => res.send('Server is running'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));