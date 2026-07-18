const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const prisma = require("./config/prisma");

// Log Cloudinary config on startup (without secrets)
console.log("Cloudinary config check:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
});

prisma.$queryRaw`SELECT 1`
    .then(() => {
        console.log("Database connected Successfully");
    })
    .catch((err) => {
        console.error("DB connection error:", err.message);
    });

app.listen(process.env.PORT || 2001, () => {
    console.log("Server works fine");
});