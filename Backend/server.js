const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store pending ride requests
let pendingRides = []; // Ideally, use a database for persistence

// Set up Socket.IO event listeners
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for ride confirmation
  socket.on("confirmRide", (rideDetails) => {
    console.log(`New ride request received: ${JSON.stringify(rideDetails)}`);
    
    // Add the ride to the pendingRides list
    const rideWithId = {
      ...rideDetails,
      id: generateUniqueId(),
      status: "pending",
      timestamp: new Date(),
    };
    pendingRides.push(rideWithId);

    // Notify all connected captains about the new ride request
    io.emit("newRideRequest", rideWithId);
  });

  // Handle captain login
  socket.on("captainLogin", () => {
    console.log(`Captain logged in: ${socket.id}`);
    
    // Send all pending rides to the captain
    pendingRides.forEach((ride) => {
      socket.emit("newRideRequest", ride);
    });
  });

    socket.on("acceptRide", (rideId, captainDetails) => {
    console.log(`Ride accepted: Ride ID - ${rideId}, Captain - ${JSON.stringify(captainDetails)}`);
    
    // Find the ride and update its status
    const rideIndex = pendingRides.findIndex((ride) => ride.id === rideId);
    if (rideIndex !== -1) {
        // Update the ride status to 'accepted' and assign the captain
        pendingRides[rideIndex] = {
        ...pendingRides[rideIndex],
        status: "accepted",
        captain: captainDetails,
        };

        // Notify the user that the ride has been accepted
        const rideDetails = pendingRides[rideIndex];
        io.to(rideDetails.userId).emit("rideAccepted", {
        rideId,
        captain: captainDetails,
        });

        // Notify all other connected captains about the accepted ride
        io.emit("rideAccepted", {
        rideId,
        captain: captainDetails,
        });

        // Remove the accepted ride from the pending list
        pendingRides = pendingRides.filter((ride) => ride.id !== rideId);
    } else {
        console.log(`Ride ID not found: ${rideId}`);
    }
    });


  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Helper function to generate unique ride IDs
function generateUniqueId() {
  return `ride_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
