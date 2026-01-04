const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = `${BASE_URL}/auth`;
const GAMIFICATION_URL = `${BASE_URL}/gamification`;

// Helper for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runSecurityTests() {
    console.log('🛡️  STARTING "BREAK-IT" SECURITY SUITE 🛡️');
    let email = `attacker_${Date.now()}@test.com`;
    let token = '';

    // 1. Setup: Create User
    try {
        console.log('\n[SETUP] Creating Attacker Account...');
        const res = await axios.post(`${AUTH_URL}/register`, {
            name: 'Attacker', email, password: 'password123', semester: 1
        });
        token = res.data.data.token;
        console.log('✅ Account Created');
    } catch (e) {
        console.error('❌ Setup Failed:', e.message);
        return;
    }

    // 2. Test Rate Limiting (DoS)
    console.log('\n[TEST 1] Rate Limiting (DoS Attempt on /me)...');
    try {
        let blocked = false;
        // API Limit is 300, so we need to hit it hard or hit the Auth limit (5)
        // Let's hit Auth limit on /login which is 5/15min
        for (let i = 0; i < 10; i++) {
            try {
                process.stdout.write(`\rRequest ${i + 1}/10...`);
                await axios.post(`${AUTH_URL}/login`, { email, password: 'wrongpassword' });
            } catch (e) {
                if (e.response && e.response.status === 429) {
                    blocked = true;
                    console.log('\n✅ Rate Limit Triggered! (429 Too Many Requests)');
                    break;
                }
            }
        }
        if (!blocked) console.log('\n❌ Rate Limit NOT Triggered (Check configuration)');
    } catch (e) {
        console.error('Test Error:', e.message);
    }

    // 3. Test Negative Number Exploit (Gamification)
    console.log('\n[TEST 2] Negative Number Exploit (Infinite Money Glitch)...');
    try {
        await axios.post(`${GAMIFICATION_URL}/purchase`, {
            itemId: 'exploit_item',
            type: 'feature',
            cost: { coins: -10000 } // Should be rejected
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.error('❌ FAILED: Server accepted negative cost!');
    } catch (e) {
        if (e.response && e.response.data.errors) {
            const errs = JSON.stringify(e.response.data.errors);
            if (errs.includes('must be positive')) {
                console.log(`✅ Server Correctly Rejected Payload: ${errs}`);
            } else {
                console.log(`⚠️  Rejected but unexpected error: ${errs}`);
            }
        } else {
            console.log(`✅ Request Failed (Good): ${e.response?.status}`);
        }
    }

    // 4. Test Payload Size (AI DoS)
    console.log('\n[TEST 3] Massive Payload Attack (AI Service)...');
    try {
        const massivePayload = {
            userId: "attacker",
            performance: { "math": "A" },
            semester: 1,
            extraData: "A".repeat(1024 * 1024) // 1MB String
        };
        // This hits the node proxy first, then python. Node doesn't validate size explicitly but Python does.
        // Actually, Express body-parser might limit it (default 100kb).
        await axios.post(`${BASE_URL}/onboarding/complete`, massivePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.error('❌ Server accepted 1MB payload (Check body-parser limit)');
    } catch (e) {
        if (e.response && e.response.status === 413) {
            console.log('✅ Payload Too Large (413) - Express Blocked it');
        } else if (e.response && e.response.status === 500) {
            console.log('⚠️  Server Error (500) - Likely Python side rejected or timed out');
        } else {
            console.log(`✅ Request Failed: ${e.response?.status} - ${e.message}`);
        }
    }

    console.log('\n--- 🏁 SECURITY SUITE COMPLETE 🏁 ---');
}

runSecurityTests();
