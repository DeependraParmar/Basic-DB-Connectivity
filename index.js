import mongoose from "mongoose";
import { User } from "./User.js";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/mongoform", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongo connected successfully...");
    } catch (error) {
        console.error("Mongo connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

const app = express();

connectDB();
app.use(express.json());

// serving index.html from here
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req, res, next) => {
    const file = path.resolve("public/index.html");
    res.sendFile(file);
});

app.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.status(403).json({
            success: false,
            message: "User already exists",
        });
    }

    const user = await User.create({ name, email, password });

    res.status(200).json({
        success: true,
        message: `Welcome ${name}, get started now`,
        user,
    });
});

app.listen(3000, () => {
    console.log(`Server live at http://localhost:3000`);
});
