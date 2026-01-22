require('dotenv').config();
const mongoose = require('mongoose');

console.log("--- DIAGNOSTIC START ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("JWT_SECRET Exists:", !!process.env.JWT_SECRET);
console.log("JWT_SECRET Length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
console.log("MONGO_URI Exists:", !!process.env.MONGO_URI);

if (!process.env.JWT_SECRET) {
    console.error("CRITICAL: JWT_SECRET is missing! Login will fail with 500.");
} else {
    console.log("JWT Config looks OK.");
}

console.log("--- DIAGNOSTIC END ---");
process.exit(0);
