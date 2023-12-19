import mongoose from "mongoose";

/* Datos historicos de una compra */
const purchasesCollection = "purchase";

const purchaseSchema = new mongoose.Schema({
    items: [
      {
        product: {
          title: String,
          price: Number,
        },
        quantity: Number
      }
    ],
    client: {
      name: String,
      email: String
    },
    purchase_datetime:{type: Date, default: Date.now}
    
  });
 export const purchaseModel = mongoose.model(purchasesCollection, purchaseSchema);
  