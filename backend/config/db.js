const mongoose = require('mongoose');

const connectToDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database.")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = connectToDb;

 