import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./db/DBConnection.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigin = process.env.BASE_URL; // Set default URL to localhost if BASE_URL is not defined

app.use(
  cors({
    origin: allowedOrigin, // Allow requests from the frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods if needed
    credentials: true, // Allow cookies (if needed)
  })
);

app.use(cors());
app.use(express.json()); // to parse incoming json requests

ConnectDB();
console.log(allowedOrigin);

app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
