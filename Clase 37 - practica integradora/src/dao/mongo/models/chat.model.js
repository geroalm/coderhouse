import mongoose, { Mongoose } from "mongoose";

const chatCollection = "messages";
const chatScheme = new mongoose.Schema({
    user:{
        type:String,
        requiered:true,
    },
    message:{
        type:String,
        required:true
    }

})         

export const chatModel = mongoose.model(chatCollection,chatScheme);
