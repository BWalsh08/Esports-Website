const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public'));

// Route to handle GET requests to the root URL ('/')
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});