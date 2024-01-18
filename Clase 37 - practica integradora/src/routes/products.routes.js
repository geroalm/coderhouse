import { Router } from "express";
import { ProductsController } from "../controller/ProductsController.js";
import { checkRole, isAuth, isProductOwnerOrAdmin } from "../middlewares/auth.js";
const router = Router();

router.get("/mockingproducts",  ProductsController.getProductsMocking)

router.get("/",isAuth, checkRole(["admin"]), ProductsController.getAll)

/* Obtiene un producto en particular pasado por parametro */
router.get("/:id", ProductsController.getOne);

/* Crear producto */
router.post("/", isAuth, checkRole(["admin"]), ProductsController.addProduct)

/* Actualizar producto */
router.put("/:id", isAuth, isProductOwnerOrAdmin(), ProductsController.updateProduct)

/* Eliminar producto */ 
router.delete("/:id", isAuth, isProductOwnerOrAdmin(), ProductsController.deleteProduct)




export {router as productRoutes}