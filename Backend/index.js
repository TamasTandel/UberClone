const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//
app.listen(PORT, () => {
    console.log(`Server is running on https://uber-clone-roan-xi.vercel.app:${PORT}`);
});
