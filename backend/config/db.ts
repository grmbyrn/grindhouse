import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error){
        console.error(`MongoDB connection failed: ${(error as Error).message}`);
        // Without a database every request would fail, so stop and let the host restart us
        process.exit(1)
    }
}

export default connectDB