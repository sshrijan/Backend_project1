
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const CONNECT_DB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB CONNECTED SUCCESSFULLY || DB Host :${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR",error);
        process.exit(1);
    }
}

export default CONNECT_DB;
