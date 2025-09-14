const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log("MongoDb connection error")
        process.exit(1)
    }
}

module.exports = connectToDB;