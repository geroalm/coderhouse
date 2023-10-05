import mongoose, { Mongoose } from "mongoose";

const productsCollection = "products";
const productScheme = new mongoose.Schema({
    title:{
        type:String,
        requiered:true,
    },
    description:String,
    price:{
        type:Number,
        required:true
    },
    code:{
        type:String,
        required:true,
        unique: true
    },
    status:Boolean,
    stock:{
            type:Number,
            required:true
    },
    category:{
            type:String,
            required:true,
            enums:["Ropa","Tecnologia","Deportes"]
    },
    thumbnails:String    

})         

export const productsModel = mongoose.model(productsCollection,productScheme);
