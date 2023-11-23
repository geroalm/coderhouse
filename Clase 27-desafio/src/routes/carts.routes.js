import { Router } from "express"; //importa una funcion del modulo express
import { CartsController } from "../controller/CartsController.js";

const router = Router();    //llama a la funcion que devuelve un Router y lo guardo en la variable router


/* Trae todos los carritos */ 
router.get("/", CartsController.getCarts);

/* Trae un carrito */
router.get("/:id", CartsController.getOneCart);

/*  Creo un carrito Vacio */
router.post("/", CartsController.createCart)


/*  Agrego item a un carrito, Item 
{prod, cantidad} */
router.post("/:cId/products/:pId", CartsController.addItem)

/* Eliminar producto del carrito */
router.delete("/:cId/products/:pId", CartsController.deleteItem)

/* Eliminar todos los prductos del carrito */
router.delete("/:cId/", CartsController.deleteAllItems)

/*actualiza los items del producto, segun el array de items pasados por body */
router.put("/:cId", CartsController.setItems)


/*  actualiza la cantidad del producto */ 
router.put("/:cId/products/:pId", CartsController.updateProductQuantity)


export { router as cartRoutes }