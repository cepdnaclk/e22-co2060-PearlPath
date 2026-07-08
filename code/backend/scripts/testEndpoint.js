const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const test = async () => {
    // Admin ID we found in DB
    const adminId = "69f242c8d1c4e8081a2ce44f";
    // Generate token the exact same way backend does
    const token = jwt.sign({ id: adminId }, 'fallback_secret_please_change', { expiresIn: '30d' });

    try {
        const response = await fetch('http://127.0.0.1:3001/api/admin/roles/hotel_owner', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("Status:", response.status);
        const data = await response.text();
        console.log("Data:", data);
    } catch (e) {
        console.error("Error:", e);
    }
};

test();
