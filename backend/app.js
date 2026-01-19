const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes')
const connectToDb = require('./config/db');
connectToDb();
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send("hello");
})

app.use('api/auth', authRoutes);

module.exports = app;