import { Router } from "express"; //importa una funcion del modulo express
import { CartsController } from "../controller/CartsController.js";
import { isAuth, isCartOwner,checkRole } from "../middlewares/auth.js";
import { PurchaseController } from "../controller/purchaseController.js";
import { UsersService } from "../service/users.service.js";

/*
Ruta para administradores
Sin controlador de momento
TODO
*/
const router = Router();   

/* Trae todos los usuarios */ 
router.get("/",isAuth,checkRole(["admin"]), async(req,res)=>{
    try{
        const result = await UsersService.listAll();
        res.json({ status: "success", data: result });
    }
    catch(error){
        console.log(error)
        res.json({status:"error",message:"Error al listar los usuarios"})
    }
});




/*  Agrego item a un carrito, Item 
{prod, cantidad} */
// TODO: Validacion: validar que el producto tenga status activo
router.post("/:cId/products/:pId",isAuth, isCartOwner(), CartsController.addItem)


export { router as userRouter }