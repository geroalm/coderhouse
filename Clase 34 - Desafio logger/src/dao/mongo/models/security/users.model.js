import mongoose from "mongoose";
import { cartModel } from "../carts.model.js";


const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name:String,
    last_name:String,
    age:Number,
    provider:String,
    provider_id: {type: String, unique:true},  //facebook y twitter
    photo:String,
    email:String,
    createdAt:{type: Date, default: Date.now},
    password:String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default:'user'
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
});

userSchema.pre('save', async function(next){
    try {
        const newCart = await cartModel.create({})
        this.cart = newCart._id;
    } catch (error) {
        next(error);
    }
} )
export const usersModel = mongoose.model(usersCollection,userSchema);