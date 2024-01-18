import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const ticketsCollection = "tickets";
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: uuid
        },

    purchase_datetime:{type: Date, default: Date.now},
      
    amount:Number,

    purchaser:{
        type:String,
        require:true,
    }
    
});
ticketSchema.index({ code: 1 }, { unique: true });


export const ticketModel = mongoose.model(ticketsCollection,ticketSchema);
