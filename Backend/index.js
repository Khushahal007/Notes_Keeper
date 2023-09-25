const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const notesRoutes = require('./Route/notesRoute');




dotenv.config();

const app = express();

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Routes
app.use('/notes', notesRoutes);

const port = process.env.PORT || 8002;
app.listen(port, () => {
    console.log("Server is running successfully");
});
