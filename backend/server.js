const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const prisma = require("./config/prisma");

// Fail loudly at startup if upload credentials are missing, rather than
// letting every CV upload fail mysteriously at request time.
const missingCloudinary = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]
    .filter((k) => !process.env[k]);
if (missingCloudinary.length) {
    console.error(`Cloudinary not configured — missing: ${missingCloudinary.join(", ")}. CV uploads will fail.`);
}

prisma.$queryRaw`SELECT 1`
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("DB connection error:", err.message);
    });

// Keep the process alive through unexpected async faults. Without these, a
// single stray rejection (a failed ticket email, a dropped DB socket) exits
// the process and takes the whole form offline until the host restarts it.
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason instanceof Error ? reason.message : reason);
});
process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err.message);
});

const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});