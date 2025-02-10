const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
require('dotenv').config();
const { confirmRide } = require('./controllers/maps.controller');

const server = http.createServer(app);

function generateUniqueId() {
  return `ride_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
