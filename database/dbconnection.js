import mongoose from "mongoose";

const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName : "PORTFOLIO"
    }).then(()=>{
        console.log("Connected to database.");
    }).catch((error)=>{
        console.log(`Some Error Ocurred While Connecting to Database: ${error}`);
    });
};

export default dbConnection;