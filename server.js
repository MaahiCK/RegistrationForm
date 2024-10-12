const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // replace with your host if not localhost
    user: 'root', // replace with your MySQL username
    password: 'Mahi2323', // replace with your MySQL password
    database: 'user_registration' // database created earlier
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { user_id, mobile_number, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Insert user into database
        const query = 'INSERT INTO users (user_id, mobile_number, password) VALUES (?, ?, ?)';
        db.query(query, [user_id, mobile_number, hash], (error, results) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).json({ message: 'Error inserting user', error: error.sqlMessage });
            }
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
