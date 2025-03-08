const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Middleware for validating product input
const validateProductInput = (req, res, next) => {
    const { name, price, category } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Name is required and should be at least 2 characters long'
        });
    }

    if (!price || isNaN(price) || price <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Price is required and should be a positive number'
        });
    }

    if (category && typeof category !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Category must be a string'
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
            error: 'Invalid product ID provided'
        });
    }
    req.params.id = id;
    next();
};

// Middleware for validating price range
const validatePriceRange = (req, res, next) => {
    const { minPrice, maxPrice } = req.query;
    
    if (minPrice && (isNaN(minPrice) || parseFloat(minPrice) < 0)) {
        return res.status(400).json({
            success: false,
            error: 'minPrice must be a non-negative number'
        });
    }

    if (maxPrice && (isNaN(maxPrice) || parseFloat(maxPrice) < 0)) {
        return res.status(400).json({
            success: false,
            error: 'maxPrice must be a non-negative number'
        });
    }

    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        return res.status(400).json({
            success: false,
            error: 'minPrice cannot be greater than maxPrice'
        });
    }

    next();
};

// Routes with validation
router.route('/')
    .get((req, res, next) => {
        // Handle query parameters for filtering, sorting, and pagination
        const {
            page = 1,
            limit = 10,
            sortBy = 'id',
            sortOrder = 'asc',
            category,
            minPrice,
            maxPrice,
            search
        } = req.query;

        req.queryParams = {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder: sortOrder.toLowerCase(),
            filters: {
                category,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                search
            }
        };
        next();
    }, validatePriceRange, getProducts)
    .post(validateProductInput, createProduct);

router.route('/:id')
    .get(validateIdParam, getProduct)
    .put(validateIdParam, validateProductInput, updateProduct)
    .delete(validateIdParam, deleteProduct);

// Route for getting products by category
router.get('/category/:category', (req, res, next) => {
    req.queryParams = {
        ...req.query,
        filters: {
            category: req.params.category
        }
    };
    next();
}, getProducts);

module.exports = router; 