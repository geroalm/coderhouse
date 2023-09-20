import { Router } from "express";
import { productsService } from '../persistence/index.js';

const router = Router();

router.get("/", async(req,resp)=>{
    const query = req.query;
    let products = await productsService.getProducts(true);
    const {limit} = req.query
    if(limit){
        const limitNumber = parseInt(limit);
        const respProducts = products.slice(0,limitNumber);
        resp.status(200).send({"payloads": respProducts})
    }
    else
    resp.status(200).send({"payloads": products})
})


router.get("/:id", async (req, resp) => {
    try {
        const id = req.params.id;
        const product = await productsService.getProductById(id);
        resp.send(product);       
    } catch (error) {
        resp.send(error.message);
    }
});


router.post("/",async(req,resp)=>{
    const newProduct = req.body;
    try{
        if(!newProduct.title || !newProduct.price || !newProduct.thumbnails || !newProduct.description || !newProduct.code || !newProduct.stock){
            throw new Error("Todos los campos son obligatorios")
        }
        newProduct.status=true;
        await productsService.addProduct(newProduct)
        resp.status(200).send({ message: "Producto agregado",producto:newProduct});
    }
    catch(error){
        resp.status(500).send({ error: error.message });
    }
})

router.put("/:id",async (req,resp)=>{
        try { 
            const newData = req.body;
            const id = req.params.id;
            const existingProduct = await productsService.getProductById(id);
    
            if (!existingProduct) {
                throw new Error("Producto no encontrado.");
            }
    
            const updatedProduct = {
                ...existingProduct,
                ...newData,
                id: parseInt(id)
            };
            //Traigo los productos y reemplazo con el nuevo
            let products = await productsService.getProducts();
                products = products.map(product => 
                product.id === parseInt(id) ? updatedProduct : product
            );

            await productsService.persistProducts(products)
    
            resp.status(200).send("Producto modificado correctamente")
        } catch (error) {
            resp.status(400).send("Hubo un error al intentar actualizar el producto")

        }
    

})

router.delete("/:id", async(req,resp)=>{
    const id = req.params.id;
    try{
        const toDeleteProd = await productsService.getProductById(id);
        if (!toDeleteProd) throw new Error({message:"El producto que intenta borrar no fue encontrado"});
        toDeleteProd.status=false;
        let products = await productsService.getProducts();
            products = products.map(product => 
                product.id === parseInt(id) ? toDeleteProd : product
            );
            await productsService.persistProducts(products)
            resp.status(200).send("Producto eliminado")

        
    }
    catch(error){
     resp.status(404).send(error.message)
    }
})


export {router as productRoutes}