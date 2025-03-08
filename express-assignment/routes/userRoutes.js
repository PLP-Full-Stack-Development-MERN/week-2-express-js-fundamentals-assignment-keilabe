const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Middleware for validating user input
const validateUserInput = (req, res, next) => {
    const { name, email } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Name is required and should be at least 2 characters long'
        });
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide a valid email address'
        });
    }

    next();
};

// Middleware for validating ID parameter
const validateIdParam = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid user ID provided'
        });
    }
    req.params.id = id;
    next();
};

// Routes with validation
router.route('/')
    .get((req, res, next) => {
        // Handle query parameters for filtering and pagination
        const { page = 1, limit = 10, sortBy = 'id', name, email } = req.query;
        req.queryParams = {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            filters: { name, email }
        };
        next();
    }, getUsers)
    .post(validateUserInput, createUser);

router.route('/:id')
    .get(validateIdParam, getUser)
    .put(validateIdParam, validateUserInput, updateUser)
    .delete(validateIdParam, deleteUser);

// Additional route for searching users
router.get('/search', (req, res, next) => {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Search query must be at least 2 characters long'
        });
    }
    next();
}, getUsers);

module.exports = router; 