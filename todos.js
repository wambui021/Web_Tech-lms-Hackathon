const express = require('express');
const router = express.Router();
const pool = require('./db');

// GET all todos
router.get('/todos', (req, res) => {
    pool.query('SELECT * FROM todos', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Add more routes for other CRUD operations

module.exports = router;