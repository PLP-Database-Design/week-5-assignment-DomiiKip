// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Create an instance of the express app
const app = express();
app.use(express.json());


// Home route
app.get('/', (req, res) => {
    console.log('Home route accessed');
    res.send('Welcome to the Hospital API! Use /patients or /providers to retrieve data.');
  });

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the database connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// Retrieve all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  const sql = 'SELECT * FROM patients WHERE first_name = ?';
  db.query(sql, [first_name], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const sql = 'SELECT * FROM providers WHERE provider_specialty = ?';
  db.query(sql, [specialty], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

