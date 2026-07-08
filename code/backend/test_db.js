const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const Booking = require('./models/Booking');
const User = require('./models/User');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully");

        const allNotifications = await Notification.find().populate('userId', 'firstName lastName email');
        console.log("Total Notifications found in DB:", allNotifications.length);
        console.log("--- All Notifications ---");
        allNotifications.forEach((n, idx) => {
            console.log(`${idx + 1}. User: ${n.userId?.email || n.userId} | Msg: "${n.message}" | Read: ${n.isRead}`);
        });

        const bookings = await Booking.find().populate('userId', 'email').populate('providerId', 'email');
        console.log("\nTotal Bookings in DB:", bookings.length);
        bookings.forEach((b, idx) => {
            console.log(`${idx + 1}. Booking ID: ${b._id} | User: ${b.userId?.email} | Provider: ${b.providerId?.email} | Status: ${b.bookingStatus}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}

run();
