import { Router } from "express"; //importa una funcion del modulo express
import { productsService, cartsService } from "../dao/index.js";
import { Cart } from "../classes/cart.js";

const router = Router();    //llama a la funcion que devuelve un Router y lo guardo en la variable router


// Trae todos los carritos
router.get("/", async (req,resp)=>{
    try {
        const result = await cartsService.getCarts();  
        resp.json({status:"success",data:result});
    } catch (error) {
        resp.json({status:"error",data:"Error al recuperar los carritos"});

    }
});

// Trae un carrito 
router.get("/:id", async (req, resp) => {
    try {
        const id = req.params.id;
        console.log("id a buscar: ",id);
        const cart = await cartsService.getCartById(id);
        resp.send(cart);       
    } catch (error) {
        resp.send(error.message);
    }
});
// Creo un carrito Vacio
router.post("/",async (req,resp)=>{
    try{
        let cart = new Cart();
        const result = await cartsService.createCart(cart);

        resp.json({state:"success",data:result});
    }
    catch(error){
        resp.status(500).send({message: "No pudo crearse el carrito, una pena", error:error.message})
    }
    
})
// Agrego item a un carrito, Item {prod, cantidad}
router.post("/:cId/products/:pId", async (req,resp)=>{
    try {
        const cartId = req.params.cId;
        const productId = req.params.pId;
        if(!cartId || !productId) throw new Error("Campos incompletos");

        await cartsService.addProduct(cartId,productId);
        resp.status(200).send({message: "Carrito actualizado "});

    }catch(error){
        throw (error);
    }
})


// Si  encuentro el product le sumo uno sino lo agrego a la lista de items para el carrito

        //Eliminar producto del carrito
        router.delete("/:cId/products/:pId", async (req,resp)=>{
            const cId = req.params.cId;   const pId = req.params.pId;
         
           try {        
               const cartResult = await cartsService.getByIdAndDeleteProd(cId,pId);
               resp.json({status:"success",deleted:cartResult})
           } catch (error) {
            resp.status(500).json({status:"error",message:error.message})
           }
        })

        //Eliminar todos los prductos del carrito
        router.delete("/:cId/", async (req,resp)=>{
            const cId = req.params.cId; 
         
           try {        
               const cartResult = await cartsService.resetCart(cId);
               resp.json({status:"success",result:cartResult})
           } catch (error) {
            resp.status(500).json({status:"error",message:error.message})
           }
        })

        //actualiza los items del producto, segun el array de items pasados por body
        router.put("/:cId", async (req,resp)=>{
            const cId = req.params.cId;
            const newItems = req.body; // array de items {product, quantity}
            try {
                const result = await cartsService.getByIdAndUpdateProd(cId,newItems);
                resp.json({status:"success", data:result});
            } catch (error) {
                resp.json({status:"error",message:"No se pudo actualizar el carrito"})  
            }
        })
        // actualiza la cantidad del producto pasado en el carrito
        router.put("/:cId/products/:pId", async (req,resp)=>{
            const cId = req.params.cId; const pId = req.params.pId
            const newQuantity= req.body;
            try{
                const result = await cartsService.updateProductQuantity(cId,pId,newQuantity);
                resp.json({status:"success", data:result});
            }catch(error){
                resp.json({status:"error",message:"No se pudo actualizar el carrito"})
                console.log(error);  

            }

        })
    

export {router as cartRoutes}