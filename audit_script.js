const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000/api';
const AI_URL = 'http://localhost:5001';

async function runAudit() {
    console.log('🚀 Starting System Audit...');
    let score = 0;
    const total = 5;

    // 1. Check AI Service
    try {
        const aiHealth = await axios.get(`${AI_URL}/health`);
        if (aiHealth.status === 200) {
            console.log('✅ AI Service (5001): ONLINE');
            score++;
        }
    } catch (e) {
        console.log('❌ AI Service (5001): OFFLINE or UNREACHABLE');
        console.error(e.message);
    }

    // 2. Check Backend Health
    try {
        const backendHealth = await axios.get('http://localhost:5000/');
        if (backendHealth.status === 200) {
            console.log('✅ Backend Service (5000): ONLINE');
            score++;
        }
    } catch (e) {
        console.log('❌ Backend Service (5000): OFFLINE');
        console.error(e.message);
    }

    // 3. Check Auth (Login with dummy valid creds - expected to fail 401 but connect)
    try {
        await axios.post(`${BACKEND_URL}/auth/login`, { email: 'test@test.com', password: 'wrongpassword' });
    } catch (e) {
        if (e.response && e.response.status === 401) {
            console.log('✅ Auth Endpoint: REACHABLE (401 response received)');
            score++;
        } else {
            console.log('❌ Auth Endpoint: FAILED (Network/Crash)');
            console.error(e.message);
        }
    }

    // 4. Check AI Proxy through Backend
    // We expect 401 because we are not logged in, but checking if it proxies.
    // Actually, we can check a public endpoint if any? No.
    // But if we get 401 from Backend, it means Backend is handling it.

    // 5. Check Database connection (implied by Backend Health usually, but let's check a data route)
    // GET /api/roadmaps/public (if exists) or similar.
    // We'll skip deep DB check for this quick script.

    console.log(`\n🏁 Audit Complete. Score: ${score}/3 Critical Services`);
}

runAudit();
