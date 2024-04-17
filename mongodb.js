import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// DB Url and Settings
const url = process.env.MONGO_URI || "mongodb://localhost:27017/";
const dbName = 'mydb'; // Database name

let dbInstance = null;

// Connect to the MongoDB server
export const connectDB = async () => {
    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db(dbName);
        console.log("MongoDB connected successfully");
        dbInstance = db;
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        process.exit(1); // Stop the node.js process if unable to connect
    }
};

// Function to get the database instance
export const getDB = () => {
    if (!dbInstance) throw new Error('Database not initialized. Call connectDB first.');
    return dbInstance;
};
