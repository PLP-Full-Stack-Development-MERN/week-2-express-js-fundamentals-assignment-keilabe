// Enable debugging
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Mandatory (as per the Node.js docs)
});

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // HTTP request logger
app.use(logger); // Custom logger

// Test route to verify server is working
app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Server is working!' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.json({ message: 'Welcome to the Express.js Fundamentals API' });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle 404 errors
app.use((req, res) => {
    console.log('404 route hit:', req.url);
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Error handling for the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to test the API`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('=================================');
})
.on('error', (error) => {
    console.error('Server Error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
    } else {
        console.error('Failed to start server:', error.message);
    }
    process.exit(1);
}); 