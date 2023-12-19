import { CartsService } from "../service/carts.service.js";
import { Cart } from "../classes/cart.js";
export class CartsController{

    /* Obtiene todos los carritos */
   static  getCarts  = async (req, resp) => {
        try {
            const result = await CartsService.getCarts();
            resp.json({ status: "success", data: result });
        } catch (error) {
            resp.json({ status: "error", data: "Error al recuperar los carritos" });
        }
    }

    /* Obtiene un carrito segun el cart Id pasado por param */
  static getOneCart = async (req, resp) => {
    try {
        const id = req.params.id;
        console.log("id a buscar: ", id);
        const cart = await CartsService.getCartById(id);
        resp.send(cart);
    } catch (error) {
        resp.send(error.message);
    }
}

/* Crea un carrito vacio */
    static createCart = async (req, resp) => {
        try {
            let cart = new Cart();
            const result = await CartsService.createCart(cart);
    
            resp.json({ state: "success", data: result });
        }
        catch (error) {
            resp.status(500).send({ message: "No pudo crearse el carrito, una pena", error: error.message })
        }
    
    }

/*      Agrego item a un carrito, Item {producto, cantidad} 
            Recibe Cart ID y el producto cuyo item se debe agregar
            "/:cId/products/:pId" */
     static addItem = async (req, resp) => {
        try {
            const cartId = req.params.cId;
            const productId = req.params.pId;
            if (!cartId || !productId) throw new Error("Campos incompletos");
    
            await CartsService.addProduct(cartId, productId);
            resp.status(200).send({ message: "Carrito actualizado " });
    
        } catch (error) {
            throw (error);
        }
    }

    /* Eliminar item del carrito 
        Recibe Cart ID y el producto cuyo item se debe borrar
         "/:cId/products/:pId" */
    static deleteItem = async (req, resp) => {
        const cId = req.params.cId; const pId = req.params.pId;
        try {
            const cartResult = await CartsService.getByIdAndDeleteProd(cId, pId);
            resp.json({ status: "success", deleted: cartResult })
        } catch (error) {
            resp.status(500).json({ status: "error", message: error.message })
        }
    }

    /* Eliminar todos los items (Vaciar carrito) 
        Recibe el Cart Id por parametro*/
    static deleteAllItems = async (req, resp) => {
        const cId = req.params.cId;
        try {
            const cartResult = await CartsService.resetCart(cId);
            resp.json({ status: "success", result: cartResult })
        } catch (error) {
            resp.status(500).json({ status: "error", message: error.message })
        }
    }

    /* Setea un nuevo array de items 
        Recibe un cart ID y por Body el array de items */
    static setItems = async (req, resp) => {
        const cId = req.params.cId;
        const newItems = req.body; // array de items {product, quantity}
        try {
            const result = await CartsService.getByIdAndUpdateProd(cId, newItems);
            resp.json({ status: "success", data: result });
        } catch (error) {
            resp.json({ status: "error", message: "No se pudo actualizar el carrito" })
        }
    }

    /*  Actualiza la cantidad de un producto para un carrito
        Recibe el carrito y producto por paramentro, y la cantidad en el Body de la peticion
            /:cId/products/:pId"    */
    static updateProductQuantity = async (req, resp) => {
        const cId = req.params.cId; const pId = req.params.pId
        const newQuantity = req.body;
        try {   
            const result = await CartsService.updateProductQuantity(cId, pId, newQuantity);
            resp.json({ status: "success", data: result });
        } catch (error) {
            resp.json({ status: "error", message: "No se pudo actualizar el carrito" })
            console.log(error);
    
        }
    }
}