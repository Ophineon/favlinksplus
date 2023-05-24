// server/index.js
const express = require('express');
const path = require('path');

const app = express();

const { Pool } = require('pg');
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432, // default PostgreSQL port
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//THIS IS WHERE I WILL VENT MY FRUSTRATIONS GETTING THIS TO WORK
/* The silly index.html file in the build version of the app was, for some stupid reason
made into a string which made every attempt I made to have this appear on the server for the
last i dunno 2-4 hours on this slow computer only appear as a blank page.

The differences in folder and variable names is getting on my nerves. 
'The folder should be called server here' with another server folder in it, no 
 a server js file in it at the root not in the folder, the folder with the same name
 is completely pointless, I hate that website article, what a waste of time
 
 every two seconds getting a directory error wondering why ...
 
 had to make a build version to host the stupid thing without npm starting it
 that was annoying took another hour */



 //database

// Create a PostgreSQL connection pool

// GET: /
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

// GET: /links
app.get('/links', (req, res) => {
  pool.query('SELECT * FROM links', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results.rows);
    }
  });
});

// GET: /links/:id
app.get('/links/:id', (req, res) => {
  const linkId = req.params.id;
  pool.query('SELECT * FROM links WHERE id = $1', [linkId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'Link not found' });
    } else {
      res.json(results.rows[0]);
    }
  });
});

// POST: /links
app.post('/links', (req, res) => {
  // Assuming request body contains link data
  const { title, url } = req.body;
  pool.query('INSERT INTO links (title, url) VALUES ($1, $2) RETURNING *', [title, url], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json(results.rows[0]);
    }
  });
});

// PUT: /links/:id
app.put('/links/:id', (req, res) => {
  const linkId = req.params.id;
  // Assuming request body contains updated link data
  const { title, url } = req.body;
  pool.query('UPDATE links SET title = $1, url = $2 WHERE id = $3 RETURNING *', [title, url, linkId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'Link not found' });
    } else {
      res.json(results.rows[0]);
    }
  });
});

// DELETE: /links/:id
app.delete('/links/:id', (req, res) => {
  const linkId = req.params.id;
  pool.query('DELETE FROM links WHERE id = $1 RETURNING *', [linkId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: 'Link not found' });
    } else {
      res.json({ message: 'Link deleted successfully' });
    }
  });
});

app.listen(8000, function() {
  console.log('Server is listening on port 8000');
});