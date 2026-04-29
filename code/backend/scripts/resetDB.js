const mongoose = require('mongoose');

const uri = 'mongodb://tharakadenuwan5555:tharaka@ac-z2gc85q-shard-00-00.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-01.4gvkuaf.mongodb.net:27017,ac-z2gc85q-shard-00-02.4gvkuaf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8sd9oz-shard-0&authSource=admin&retryWrites=true&w=majority';

const resetDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        
        console.log('Connected. Dropping database...');
        await mongoose.connection.db.dropDatabase();
        
        console.log('Database dropped successfully!');
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
};

resetDatabase();
