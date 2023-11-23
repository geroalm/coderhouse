import { ProductsService } from "../service/products.service.js";
export class ProductsController{

    /* Obtiene todos los productos
        query params: limit,page,category,stock
        retorna un dataProduct con informacion sobre la paginacion */
    static getAll = async(req,resp)=>{
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
                let result = await ProductsService.getProducts(query,options)
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
        
       
    
    }
    /* Agrega un producto pasado por Body */
    static addProduct = async(req,resp)=>{
        const newProduct = req.body;
        try{
            if(!newProduct.title || !newProduct.price || !newProduct.thumbnails || !newProduct.description || !newProduct.code || !newProduct.stock){
                throw new Error("Todos los campos son obligatorios")
            }
            newProduct.status=true;
            await ProductsService.createProduct(newProduct)
            resp.status(200).send({ message: "Producto agregado",producto:newProduct});
        }
        catch(error){
            console.log(error);
            resp.status(500).send({ error: error.message });
        }
    }

    /* Actualiza el producto pasado por parametros con los datos pasados en body */
    static updateProduct = async (req,resp)=>{
        try { 
            const newData = req.body;
            const id = req.params.id;
            const result = await ProductsService.updateProduct(id,newData);

            resp.json({status:"success",data:result})
        } catch (error) {
            console.log(error);
            resp.status(400).send("Hubo un error al intentar actualizar el producto")
        }
}
    /* Elimina el Prodcuto pasado por parametro */
    static deleteProduct = async(req,resp)=>{
        const id = req.params.id;
        try{
            const toDeleteProd = await ProductsService.getProductById(id);
            if (!toDeleteProd) throw new Error({message:"El producto que intenta borrar no fue encontrado"});
            toDeleteProd.status=false;
                await ProductsService.updateProduct(id,toDeleteProd)
                resp.status(200).send("Producto eliminado")
        }
        catch(error){
         resp.status(404).send(error.message)
        }
    }


}