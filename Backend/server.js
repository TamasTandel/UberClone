const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;
require('dotenv').config();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "https://uber-clone-3.vercel.app", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const { confirmRide } = require('./controllers/maps.controller');  // Assuming you have a ride controller for confirming rides

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

socket.on("rideRequest", (rideData) => {
  console.log("Received ride request:", rideData);
  setRideRequests((prevRequests) => [...prevRequests, rideData]);
});

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

function generateUniqueId() {
  return `ride_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
