// Temporary in-memory storage
let users = [];

// Get all users
exports.getUsers = (req, res) => {
    const { page = 1, limit = 10, filters = {} } = req.queryParams || {};
    res.json({
        success: true,
        data: users,
        pagination: {
            page,
            limit,
            total: users.length
        }
    });
};

// Get single user
exports.getUser = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    res.json({
        success: true,
        data: user
    });
};

// Create new user
exports.createUser = (req, res) => {
    const { name, email } = req.body;
    const newUser = {
        id: users.length + 1,
        name,
        email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    res.status(201).json({
        success: true,
        data: newUser
    });
};

// Update user
exports.updateUser = (req, res) => {
    const { name, email } = req.body;
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        data: user
    });
};

// Delete user
exports.deleteUser = (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    users.splice(index, 1);
    res.status(204).send();
}; 