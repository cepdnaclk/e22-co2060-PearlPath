require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
const hotelRouter = require('./routers/hotelRouter');
const bookingRouter = require('./routers/bookingRouter');
const tourGuideRouter = require('./routers/tourGuideRouter');
const vehicleRouter = require('./routers/vehicleRouter');
const adminRouter = require('./routers/adminRouter');
const notificationRouter = require('./routers/notificationRouter');
const routeRouter = require('./routers/routeRouter');
const chatRouter = require('./routers/chatRouter');


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`[Response] ${req.method} ${req.url} -> ${res.statusCode}`);
    });
    next();
});


const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';
const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
connect();

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api', userRouter);
app.use('/api', hotelRouter);
app.use('/api', bookingRouter);
app.use('/api', tourGuideRouter);
app.use('/api', vehicleRouter);
app.use('/api', adminRouter);
app.use('/api', notificationRouter);
app.use('/api', routeRouter);
app.use('/api', chatRouter);


