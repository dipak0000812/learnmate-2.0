
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    semester: 3
};

async function testAuth() {
    try {
        console.log('--- 🚀 Starting Auth Logic Test ---');

        // 1. Register
        console.log(`\n1. Testing Registration for ${TEST_USER.email}...`);
        const regRes = await axios.post(`${BASE_URL}/register`, TEST_USER);
        console.log('✅ Registration Successful:', regRes.data.status);

        const token = regRes.data.token;
        if (!token) throw new Error('No token received after registration');

        // 2. Login
        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        console.log('✅ Login Successful:', loginRes.data.status);
        console.log('   User ID:', loginRes.data.user._id);

        // 3. Protected Route (Me)
        console.log('\n3. Testing Protected Route (/me)...');
        const meRes = await axios.get(`${BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ /me Route Accessible:', meRes.data.data.email === TEST_USER.email);

        // 4. Invalid Login
        console.log('\n4. Testing Invalid Login...');
        try {
            await axios.post(`${BASE_URL}/login`, {
                email: TEST_USER.email,
                password: 'wrongpassword'
            });
            console.error('❌ Failed: Invalid login should have thrown error');
        } catch (e) {
            console.log('✅ Invalid Login correctly rejected:', e.response?.data?.message || e.message);
        }

        console.log('\n--- 🎉 All Auth Tests Passed ---');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response?.data || error.message);
    }
}

testAuth();
