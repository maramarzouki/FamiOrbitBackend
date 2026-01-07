const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan')

const userRoutes = require('./routes/userRoutes');
const childRoutes = require('./routes/childRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/', userRoutes);
app.use('/', childRoutes);

mongoose.connect('mongodb://0.0.0.0:27017/FamiOrbit')

const port = process.env.PORT || 3001;
app.listen(port, console.log(`Listening on port ${port}`));