import { purchaseModel } from "./models/purchase.model.js";

export class PurchaseManagerMongo{
    constructor(){
        this.model = purchaseModel;
}

/* Busca compras de un USUARIO */
//TODO
async findByUser(pEmail) {
    try {
      return await this.model.find({'client.email':pEmail});
    } catch (error) {
        throw new Error("Error al recuperar el ticket")
    }
}

/* Registrar la compra */
async create(newPurchase) {
    try {
      return await this.model.create(newPurchase);
    } catch (error) {
        throw new Error("Error al crear la compra")
    }
}
async findById(pId) {
    try {
      return await this.model.findById(pId);
    } catch (error) {
        throw new Error("Error al recuperar la compra")
    }
}

}