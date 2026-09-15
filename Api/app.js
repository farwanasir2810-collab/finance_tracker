const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

app.use(
  cors({
    credentials: true,
    origin: '*',
    allowedHeaders: ['content-type', 'authorization'],
    exposedHeaders: ['x-total-count', 'x-next-key']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Base root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'FINDIARY PRO REST API active' });
});

// Dynamic route loader from /routes directory
const routesDir = path.join(__dirname, 'routes');
if (fs.existsSync(routesDir)) {
  fs.readdirSync(routesDir)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const name = path.parse(file).name;
      const routeModule = require(`./routes/${file}`);
      app.use(`/${name}`, routeModule);
      app.use(`/api/${name}`, routeModule);
    });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Centralized Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = server;
