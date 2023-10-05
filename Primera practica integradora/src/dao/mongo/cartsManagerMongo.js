import { cartModel } from "./models/carts.model.js";


export class CartsManagerMongo{
    constructor(){
        this.model = cartModel;
}
async getCarts(){
    return this.model.find().populate({path:'itemsProducts.product', select:"title"});
};
async createCart(cart){
    try {
        console.log(cart);
       const res = await this.model.create(cart)
       
       return res;
    } catch (error) {
        console.log(error)
        throw new Error("No se pudo crear el Carrito");
    }
};
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
}