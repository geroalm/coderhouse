import mongoose from "mongoose";
import { Schema } from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
    itemsProducts:{
                type:[ //un arreglo de un objeto con 2 propiedades
                    {
                        product:{
                            type:mongoose.Schema.Types.ObjectId,
                            ref: 'products' 
                        }, 
                        quantity:{
                            type:Number,
                            required:true
                        }
                    }
                  
                ],
                default:[]
    }
      
    
})
export const cartModel = mongoose.model(cartsCollection,cartSchema);
