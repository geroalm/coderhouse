import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        await mongoose.connect('mongodb+srv://geroalm:p1642qdLrBHfCSfE@gacluster.xjkvp7e.mongodb.net/Ecommerce01?retryWrites=true&w=majority');
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(`hubo un error conectando la base de datos: ${error.message}`);
    }
}