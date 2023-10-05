import { Router } from "express";
import { productsService } from '../dao/index.js';

const router = Router();

router.get("/", async(req,resp)=>{
    const query = req.query;
        try {
            let products = await productsService.getProducts(true);
            let {limit} = req.query
            if(!limit) resp.status(200).json({status:"success",data:products});
            else{
            resp.status(200).json({status:"success",data:products.slice(0,parseInt(limit))})
        }
        } catch (error) {
            resp.status(500).json({status:"error",message:error.message})
        }
    
   

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
        await productsService.createProduct(newProduct)
        resp.status(200).send({ message: "Producto agregado",producto:newProduct});
    }
    catch(error){
        console.log(error);
        resp.status(500).send({ error: error.message });
    }
})

router.put("/:id",async (req,resp)=>{
        try { 
            const newData = req.body;
            const id = req.params.id;
            const result = await productsService.updateProduct(id,newData);

            resp.json({status:"success",data:result})
        } catch (error) {
            console.log(error);
            resp.status(400).send("Hubo un error al intentar actualizar el producto")
        }
    

})

router.delete("/:id", async(req,resp)=>{
    const id = req.params.id;
    try{
        const toDeleteProd = await productsService.getProductById(id);
        if (!toDeleteProd) throw new Error({message:"El producto que intenta borrar no fue encontrado"});
        toDeleteProd.status=false;
            await productsService.updateProduct(id,toDeleteProd)
            resp.status(200).send("Producto eliminado")
    }
    catch(error){
     resp.status(404).send(error.message)
    }
})


export {router as productRoutes}