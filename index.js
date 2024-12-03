const express = require('express');
const app = express();

// Index page
app.get('/', (req, res) => {
  res.send('Welcome! Secret Word: HelloPratul'); // Replace with your secret word
});

// Docker check
app.get('/docker', (req, res) => {
  res.send('Running inside Docker!');
});

// Secret Word check
app.get('/secret_word', (req, res) => {
  res.send(`Secret Word: ${process.env.SECRET_WORD || 'Not Set'}`);
});

// Load Balancer check
app.get('/loadbalanced', (req, res) => {
  res.send('Traffic is routed via Load Balancer.');
});

// TLS check
app.get('/tls', (req, res) => {
  res.send('TLS Enabled.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

