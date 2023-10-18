import { cartModel } from "./models/carts.model.js";


export class CartsManagerMongo {
    constructor() {
        this.model = cartModel;
    }
    async getCarts() {
     //   return await this.model.find().populate({ path: 'itemsProducts.product', select: "title" });
        return await this.model.find();
    };

    async getCartById(cartId){
        try {
            const result = await this.model.findById(cartId).populate("itemsProducts.product");
            // const result = await this.model.findById(cartId);
            if(!result){
                throw new Error(`El carrito con el ID: '${cartId}' no existe.`);
            };
            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error("No se pudo obtener el carrito");
        }
    };


    async createCart(cart) {
        try {
            console.log(cart);
            const res = await this.model.create(cart)

            return res;
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo crear el Carrito");
        }
    };
    async addProduct(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);  //traigo el carrito
            console.log(cart);
            const item = cart.itemsProducts.find(item => item.product.equals(productId)); //reviso si el producto ya existe en su array

            if (item) { //si existe le sumo 1
                item.quantity += 1;
            } else { // sino agrego uno nuevo
                cart.itemsProducts.push({ product: productId, quantity: 1 });
            }
            // Guarda los camgetByIdAndUpdate(cId,pId);bios en el carrito
            await cart.save();

            return cart;
        } catch (error) {
            console.log(error);
            throw new Error("Error al intentar agregar productos al carrito")
        }
    };

    async getByIdAndDeleteProd(cId, pId) {
        const result = this.model.findByIdAndUpdate(
            cId,
            { $pull: { itemsProducts: { product: pId } } }, // The $pull operator removes from array all instances of a value or values that match a specified condition.
            { new: true }                                   //{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
        )
        return result;

    }

    async getByIdAndUpdateProd(cId, items) { 
        try {
            console.log("ITEMSPRODUCTS \n ",items.itemsProducts);
            const array = items.itemsProducts;
                const result = await this.model.findByIdAndUpdate(
                    cId,    
                    { $set: { itemsProducts: items.itemsProducts } },
                    { new: true }                                  
                );   
                
        } catch (error) {    
            return new Error("Error al intentar agregar items al carrito");

        }
    }

    async updateProductCart(cartId, productId, newQuantity){
        try {
            const cart = await this.getCartById(cartId);

            const productIndex = cart.itemsProducts.findIndex(elm=>elm.productId._id == productId);
            if(productIndex>=0){
                // //si el producto existe en el carrito
                cart.products[productIndex].quantity = newQuantity;
                const result = await this.model.findByIdAndUpdate(cartId,cart, {new:true});
                return result;
            } else {
                throw new Error("El producto no se puede actualizar porque no ha sido agregado");
            }
        } catch (error) {
            console.log("updateProductCart",error.message);
            throw new Error("No se pudo actualizar el producto al carrito");
        }
    };

}