// lib/cors.js
import initMiddleware from "./init-middleware";
import Cors from "cors";

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    // Only allow requests with these methods
    methods: ["GET", "POST", "OPTIONS"],
    origin: ["https://simple-blogspot-for-final-exam.vercel.app"], // Add your Vercel domain
  })
);

export default cors;
