const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

const app = express();
const cors = require('cors');

// Allow specific origin
app.use(cors({
  origin: '*', // Your frontend URL
  methods: ['GET', 'POST'], // Allowed methods
}));

// Or allow all origins (not recommended in production)
app.use(cors());



const port = process.env.PORT || 2000;

app.use(express.json());


app.use("/",require("./router/router"));

app.use(errorHandler);


app.listen(port, () =>{
console.log(`Server running on port ${port}`);
});