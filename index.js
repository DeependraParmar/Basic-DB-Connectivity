import mongoose from "mongoose";
import { User } from "./User.js";

const connectDB = async () => {
    await mongoose.connect("mongodb://0.0.0.0:27017/mongoform")
    console.log("Mongo connected bhaya...");
};

const app = express();

connectDB();

app.get("/", async(req,res,next) => {
    res.send("Hello from the mongoose form");
})

app.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.status(403).json({
            success: false,
            message: "User already exists",
        })
    }

    const user = await User.create({ name, email, password });

    res.status(200).json({
        success: true,
        message: `Welcome ${name}, get started now`,
        user,
    })
});


app.listen(3000, () => {
    console.log(`Server live at http://localhost:3000`);
})
