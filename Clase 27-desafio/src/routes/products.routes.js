import { Router } from "express";
import { ProductsController } from "../controller/ProductsController.js";
const router = Router();


router.get("/", ProductsController.getAll)

/* Obtiene un producto en particular pasado por parametro */
router.get("/:id", async (req, resp) => {   
    try {
        const id = req.params.id;
        const product = await productsService.getProductById(id);
        resp.send(product);       
    } catch (error) {
        resp.send(error.message);
    }
});

/* Crear producto */
router.post("/", ProductsController.addProduct)

/* Actualizar producto */
router.put("/:id", ProductsController.updateProduct)

/* Eliminar producto */ 
router.delete("/:id", ProductsController.deleteProduct)


export {router as productRoutes}