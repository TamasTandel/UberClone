const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
require('dotenv').config();

const server = http.createServer(app);

const { confirmRide } = require('./controllers/maps.controller');

function generateUniqueId() {
  return `ride_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

server.listen(port, () => {
  console.log(`Server is running on https://uber-clone-roan-xi.vercel.app:${port}`);
});
