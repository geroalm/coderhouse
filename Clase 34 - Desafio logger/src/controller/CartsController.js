import { CartsService } from "../service/carts.service.js";
import { Cart } from "../classes/cart.js";
import { addProductErrorMissingParams } from "../service/errors/cart/addProductErrorMissingParams.service.js"
import { EError } from "../enums/EError.js";
import { CustomError } from "../service/errors/customError.service.js";
import { ProductsService } from "../service/products.service.js";
export class CartsController {

    /* Obtiene todos los carritos */
    static getCarts = async (req, resp) => {
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
    static addItem = async (req, resp, next) => {
        try {
            const cartId = req.params.cId;
            const productId = req.params.pId;
            let cart;
            let product;
            try {
                const cart = await CartsService.getCartById(cartId);
                product = await ProductsService.getProductById(productId)
            }
            //
            catch (error) {
                // modificar manager para que no devuelva error si no encuentra, debe devolver null
                //lo capturo para no interrumpir la ejecucion
            }
            if (!cart || !product) {
                if (!cartId || !productId) throw new Error("Campos incompletos - faltan paramtros");
            }

            await CartsService.addProduct(cartId, productId);
            resp.status(200).send({ message: "Carrito actualizado " });

        } catch (error) {
            next(error)
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
    static updateProductQuantity = async (req, resp, next) => {
        const cId = req.params.cId; const pId = req.params.pId
        const newQuantity = req.body.quantity;
        try {
            if (!cId || !pId  || !newQuantity) { // para validar que el objeto no este vacio
                CustomError.createError({
                    name: "update product error",
                    cause: addProductErrorMissingParams(req),
                    message: "Error al actualizar el carrito, faltan parametros",
                    errorCode: EError.INVALID_PARAM
                });
            }
            const result = await CartsService.updateProductQuantity(cId, pId, newQuantity);
            console.log(`Usuario: ${req.user.email} actulizo la cantidad de producto - Producto: ${pId} cantidad: ${newQuantity}`)
            resp.json({ status: "success", data: result });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}