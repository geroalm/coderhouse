import { cartsDao } from "../dao/factory.js";

export class CartsService {


    static getCarts() {
        try {
            return cartsDao.getCarts();
        } catch (error) {
            throw new Error(error);
        }

    };


    static getCartById(cId) {
        try {
            return cartsDao.getCartById(cId);
        } catch (error) {
            throw new Error(error);
        }

    }
    static createCart(cart) {
        try {
            return cartsDao.createCart(cart);
        } catch (error) {
            throw new Error(error);
        }
    };
    static addProduct(cartId, productId) {
        try {
            return cartsDao.addProduct(cartId,productId);
        } catch (error) {
            throw new Error(error);
        }
    };
    //trae un carrito por ID y borra el producto cuya id le pases
    static getByIdAndDeleteProd(cId, pId) {
        try {
            console.log("SERVICE yendo a borrar un item del cart - cId:",cId," pId:",pId);
            return cartsDao.getByIdAndDeleteProd(cId, pId);
        } catch (error) {
            throw new Error(error);
        }
    }

    static resetCart(cId) {
        try {
            return cartsDao.resetCart(cId);
        } catch (error) {
            throw new Error(error);
        }
    }

    //recibe items nuevos, y los reemplaza en el carrito
    static getByIdAndUpdateProd(cId, newItems) {
        try {
            return cartsDao.getByIdAndUpdateProd(cId, newItems);
        } catch (error) {
            throw new Error(error);
        }
    }

    static updateProductQuantity(cId, pId, newQuantity) {
               try {
            return cartsDao.updateProductQuantity(cId, pId, newQuantity);
        } catch (error) {
            throw new Error(error);
        }
    }
}