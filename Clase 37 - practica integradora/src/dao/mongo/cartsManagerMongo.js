import { logger } from "../../helpers/logger.js";
import { cartModel } from "./models/carts.model.js";


export class CartsManagerMongo{
    constructor(){
        this.model = cartModel;
}
async getCarts(){
    return this.model.find().populate({path:'itemsProducts.product'});
    
};
async getCartById(cId) {
    try {
        const result = await this.model.findById(cId).populate({path:'itemsProducts.product'});
        return result;
    } catch (error) {
        throw new Error("Error al recuperar el carrito")
    }

}
async createCart(cart){
    try {
       const res = await this.model.create(cart);
       
       return res;

    } catch (error) {
        logger.error("Error al intentar crear un carrito")
        throw new Error("No se pudo crear el Carrito");
    }
};

//la logica hay que moverla al service
async addProduct(cartId, productId){
      try {
        const cart = await cartModel.findById(cartId);
        const item = cart.itemsProducts.find(item => item.product.equals(productId));
        if (item) {
            item.quantity += 1;
        } else {
            cart.itemsProducts.push({ product: productId, quantity:1 });
        }
        // Guarda los cambios en el carrito
        await cart.save();
        return cart;
    } catch (error) {
        console.log(error);
        throw new Error("Error al intentar agregar productos al carrito")
    }
};
//trae un carrito por ID y borra el item cuya id le pases
async getByIdAndDeleteProd(cId, pId) {
    const result = this.model.findByIdAndUpdate(
        cId,
        { $pull: { itemsProducts: { product: pId } } }, // The $pull operator removes from array all instances of a value or values that match a specified condition.
        { new: true }                                   //{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
    )
    return result;

    }

    async resetCart(cId) {
        try {
            const result = this.model.findByIdAndUpdate(
                cId,
                 { itemsProducts: [] } , 
                { new: true }                                  
            )
            return result;
        } catch (error) {
            return new Error("No se pudo vaciar el carrito")
        }

    

}
//recibe items nuevos, y los reemplaza en el carrito
async getByIdAndUpdateProd(cId,newItems){
    try {
      const cart =  this.model.findByIdAndUpdate(
            cId, 
            { itemsProducts:newItems.itemsProducts},
            { new:true }
            )
       return cart;

    } catch (error) {
        return new Error("error al intentar actualizar el carrito, \nDetalle:",error.message)
    }
}
async updateProductQuantity(cId,pId,newQuantity){
    try { 
       if(!Number.isInteger(newQuantity)) throw new Error("No se puedo actualizar el carrito, la cantidad no es correcta")
        
        const result = await this.model.findByIdAndUpdate(
            cId,
            { $set: { 'itemsProducts.$[item].quantity': newQuantity } },
            {new: true,
             arrayFilters: [{ 'item.product': pId }]    // condición que los elementos del array deben cumplir para ser actualizados.
            }, 
        )
        return result;
    } catch (error) {
        return new Error("error al intentar actualizar el carrito, \nDetalle:",error.message)
    }
}

}