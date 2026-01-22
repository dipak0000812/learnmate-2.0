const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app'); // Assuming app.js exports user
const User = require('./models/User');

require('dotenv').config();

const EMAIL = 'bugtest_' + Date.now() + '@example.com';
const PASSWORD = 'password123';

async function runTest() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);

        console.log("1. Registering user (" + EMAIL + ")...");
        const resReg = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Bug Tester',
                email: EMAIL,
                password: PASSWORD
            });

        console.log("Reg Status:", resReg.status);
        if (resReg.status !== 201) {
            console.log("Reg Body:", resReg.body);
        }

        console.log("2. Logging in...");
        const resLogin = await request(app)
            .post('/api/auth/login')
            .send({
                email: EMAIL,
                password: PASSWORD
            });

        console.log("Login Status:", resLogin.status);
        if (resLogin.status === 500) {
            console.error("CRITICAL: REPRODUCED 500 ERROR");
            console.error("Body:", resLogin.body);
            // In a real app test, we might not see stack unless in dev mode
        } else {
            console.log("Login Success/Failure:", resLogin.body);
        }

    } catch (e) {
        console.error("Test Script Error:", e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

runTest();
