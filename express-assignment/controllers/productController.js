// Temporary in-memory storage
let products = [];

// Get all products
exports.getProducts = (req, res) => {
    const { page = 1, limit = 10, filters = {} } = req.queryParams || {};
    res.json({
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total: products.length
        }
    });
};

// Get single product
exports.getProduct = (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({
            success: false,
            error: 'Product not found'
        });
    }
    res.json({
        success: true,
        data: product
    });
};

// Create new product
exports.createProduct = (req, res) => {
    const { name, price, category } = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        category,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    res.status(201).json({
        success: true,
        data: newProduct
    });
};

// Update product
exports.updateProduct = (req, res) => {
    const { name, price, category } = req.body;
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({
            success: false,
            error: 'Product not found'
        });
    }
    
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        data: product
    });
};

// Delete product
exports.deleteProduct = (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Product not found'
        });
    }
    
    products.splice(index, 1);
    res.status(204).send();
}; 