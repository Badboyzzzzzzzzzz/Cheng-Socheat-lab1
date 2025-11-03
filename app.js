const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, CI/CD!');
});

// Route with query parameters
app.get('/greet', (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).json({ error: 'Name parameter is required' });
    }
    res.json({ message: `Hello, ${name}!` });
});

// Route with URL parameters
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'User ID must be a number' });
    }
    res.json({ id: parseInt(userId), name: `User${userId}` });
});

// POST route
app.post('/calculate', (req, res) => {
    const { a, b, operation } = req.body;
    
    if (a === undefined || b === undefined || !operation) {
        return res.status(400).json({ error: 'Missing required fields: a, b, operation' });
    }
    
    if (typeof a !== 'number' || typeof b !== 'number') {
        return res.status(400).json({ error: 'a and b must be numbers' });
    }
    
    let result;
    switch (operation) {
        case 'add':
            result = a + b;
            break;
        case 'subtract':
            result = a - b;
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'divide':
            if (b === 0) {
                return res.status(400).json({ error: 'Cannot divide by zero' });
            }
            result = a / b;
            break;
        default:
            return res.status(400).json({ error: 'Invalid operation. Use: add, subtract, multiply, divide' });
    }
    
    res.json({ result });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;