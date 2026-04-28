const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
const hotelRouter = require('./routers/hotelRouter');
const bookingRouter = require('./routers/bookingRouter');
const vehicleRouter = require('./routers/vehicleRouter');


app.use(cors());
app.use(express.json());


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

const server = app.listen(3001, '127.0.0.1', () => {
    console.log('Server is running on port 3001');
});

app.use('/api', userRouter);
app.use('/api', hotelRouter);
app.use('/api', bookingRouter);
app.use('/api', vehicleRouter);


