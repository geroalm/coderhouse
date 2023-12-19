import { Router } from "express"; //importa una funcion del modulo express
import { CartsController } from "../controller/CartsController.js";
import { isAuth, isCartOwner } from "../middlewares/auth.js";
import { PurchaseController } from "../controller/purchaseController.js";

const router = Router();    //llama a la funcion que devuelve un Router y lo guardo en la variable router


/*

Implementar, en el router de carts, 
la ruta /:cid/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
La compra debe corroborar el stock del producto al momento de finalizarse
Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra. 


*/


/* Trae todos los carritos */ 
router.get("/", CartsController.getCarts);

/* Trae un carrito */
router.get("/:id", CartsController.getOneCart);

/*  Creo un carrito Vacio */
router.post("/", CartsController.createCart)


/*  Agrego item a un carrito, Item 
{prod, cantidad} */
// TODO: Validacion: validar que el producto tenga status activo
router.post("/:cId/products/:pId",isAuth, isCartOwner(), CartsController.addItem)

/* Eliminar producto del carrito */
router.delete("/:cId/products/:pId", CartsController.deleteItem)

/* Eliminar todos los prductos del carrito */
router.delete("/:cId/", CartsController.deleteAllItems)

/*actualiza los items del producto, segun el array de items pasados por body */
router.put("/:cId", CartsController.setItems)


/*  actualiza la cantidad del producto */ 
router.put("/:cId/products/:pId", CartsController.updateProductQuantity)

/* avanzar con la compra del carrito */
router.post("/:cId/purchase",isAuth, isCartOwner(),PurchaseController.purch)


export { router as cartRoutes }