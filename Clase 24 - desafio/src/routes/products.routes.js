import { Router } from "express";
import { productsService } from '../dao/index.js';

const router = Router();

router.get("/", async(req,resp)=>{
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;


    const {limit=3,page=1,category,stock} = req.query //desestructurar query
    let sortType;
    if(req.query.sort)
    if(req.query.sort==='asc') sortType = 1;
        else if(req.query.sort==='des') sortType =-1;
    
    const options = {
        limit:limit ,
        page:page,
        lean:true
    }
    if(sortType ) options.sort={price:sortType};

    const query={status:true};
    if(category) query.category=category;
    if(stock)query.stock=stock;

        try {
            let result = await productsService.getProducts(query,options)
            const dataProd = {
                status:"success",
                payload:result.docs,
                totalPages:result.totalPages,
                prevPage:result.prevPage,
                nextPage:result.prevPage,
                page:result.page,
                hasPrevPage:result.hasPrevPage,
                hasNextPage:result.hasNextPage,
                prevLink: result.hasPrevPage?baseUrl.replace(`page=${result.page}`,`page=${result.prevPage}`):null,
                nextLink: result.hasNextPage?baseUrl.includes("page")?baseUrl.replace(`page=${result.page}`,`page=${result.nextPage}`):baseUrl.concat(`?page=${result.nextPage}`) :null
                
            }
            console.log(result.docs);
            resp.json(dataProd);
        } catch (error) {
            console.log(error);
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