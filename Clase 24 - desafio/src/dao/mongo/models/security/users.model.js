
import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:String,
    provider:String,
    provider_id: {type: String, unique:true},  //facebook y twitter
    photo:String,
    email:String,
    createdAt:{type: Date, default: Date.now},
    password:String,
    role: {
        type: String,
        enum: ['admin', 'user'] 
    }
});

export const usersModel = mongoose.model(usersCollection,userSchema);