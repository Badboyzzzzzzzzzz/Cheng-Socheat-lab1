const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /', () => {
    it('should return Hello, CI/CD!', async () => {
        const res = await request(app).get('/');
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Hello, CI/CD!');
    });
});

describe('GET /greet', () => {
    it('should return greeting with name', async () => {
        const res = await request(app).get('/greet?name=John');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ message: 'Hello, John!' });
    });

    it('should return 400 if name is missing', async () => {
        const res = await request(app).get('/greet');
        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ error: 'Name parameter is required' });
    });
});

describe('GET /user/:id', () => {
    it('should return user with valid ID', async () => {
        const res = await request(app).get('/user/123');
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ id: 123, name: 'User123' });
    });

    it('should return 400 if ID is not a number', async () => {
        const res = await request(app).get('/user/abc');
        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ error: 'User ID must be a number' });
    });
});

describe('POST /calculate', () => {
    it('should add two numbers', async () => {
        const res = await request(app).post('/calculate').send({ a: 5, b: 3, operation: 'add' });
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ result: 8 });
    });

    it('should subtract two numbers', async () => {
        const res = await request(app).post('/calculate').send({ a: 10, b: 4, operation: 'subtract' });
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ result: 6 });
    });

    it('should multiply two numbers', async () => {
        const res = await request(app).post('/calculate').send({ a: 6, b: 7, operation: 'multiply' });
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ result: 42 });
    });

    it('should divide two numbers', async () => {
        const res = await request(app).post('/calculate').send({ a: 20, b: 4, operation: 'divide' });
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({ result: 5 });
    });

    it('should return 400 when dividing by zero', async () => {
        const res = await request(app).post('/calculate').send({ a: 10, b: 0, operation: 'divide' });
        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ error: 'Cannot divide by zero' });
    });

    it('should return 400 for invalid operation', async () => {
        const res = await request(app).post('/calculate').send({ a: 5, b: 3, operation: 'modulo' });
        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ error: 'Invalid operation. Use: add, subtract, multiply, divide' });
    });

    it('should return 400 if fields are missing', async () => {
        const res = await request(app).post('/calculate').send({ a: 5 });
        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ error: 'Missing required fields: a, b, operation' });
    });

    it('should return 400 if a or b are not numbers', async () => {
        const res = await request(app).post('/calculate').send({ a: 'five', b: 3, operation: 'add' });
        expect(res.status).to.equal(400);
        expect(res.body).to.deep.equal({ error: 'a and b must be numbers' });
    });
});

describe('GET /health', () => {
    it('should return health status', async () => {
        const res = await request(app).get('/health');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'healthy');
        expect(res.body).to.have.property('timestamp');
    });
});

describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown-route');
        expect(res.status).to.equal(404);
        expect(res.body).to.deep.equal({ error: 'Route not found' });
    });
});
