const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tamas310t:tamas310t@uber-fullstack-clone.uqnkg.mongodb.net/?retryWrites=true&w=majority&appName=uber-fullstack-clone";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectDB = async () => {
  try {
    // Connect the client to the server (optional starting in v4.7) 
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
