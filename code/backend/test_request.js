const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const http = require('http');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully");

        const user = await User.findOne({ email: 'chamudika31@gmail.com' });
        if (!user) {
            console.log("User not found!");
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_please_change', {
            expiresIn: '30d',
        });
        console.log("Generated token for:", user.email);

        // Make HTTP request to local backend server
        const options = {
            hostname: '127.0.0.1',
            port: 3001,
            path: '/api/notifications',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log(`BODY: ${body}`);
                process.exit(0);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            process.exit(1);
        });

        req.end();

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
