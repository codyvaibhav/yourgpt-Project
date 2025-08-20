import express from 'express';
import "dotenv/config";
import cors from 'cors';
import openai from 'openai';
import mongoose from 'mongoose';
import ChatRoutes from './routes/chat.js'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", ChatRoutes);

app.listen(PORT, (req,res) => {
    console.log(`listening to ${PORT}`);
    connectDB();
})

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected with DB");
    }catch(err){
        console.log("failed to connect with DB", err);
    }
}

