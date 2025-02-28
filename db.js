const mongoose = require('mongoose');

//Another Method to connected with the database 
const MongoURL = 'mongodb://localhost:27017/User';

const db = async () => {
    try {
        const connectionInstance = await mongoose.connect(MongoURL);
        console.log('⚙️ Connected to MongoDB Server⚙️');
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error", error);
        process.exit(1);
    }
};

module.exports = db; 
//db();

// const MongoURL = 'mongodb://localhost:27017/User'

// mongoose.connect(MongoURL);

// const db = mongoose.connection;

// db.on('error',(err)=>{
//     console.log("error is coming")
//     console.error(err)

// })

// db.on("disconnected",(req,res)=>{
//     console.log("MongoDB is Disconnected")
// })

// db.on('connected',()=>{
//     console.log('⚙️ Connected to MongoDB Server⚙️');
// });

// module.exports = db; 



