import { Router } from "express"; //importa una funcion del modulo express
import { productsService, cartsService } from "../dao/index.js";
import { Cart } from "../classes/cart.js";

const router = Router();    //llama a la funcion que devuelve un Router y lo guardo en la variable router

router.get("/", async (req,resp)=>{
    try {
        const result = await cartsService.getCarts();  
        resp.json({status:"success",data:result});
    } catch (error) {
        resp.json({status:"error",data:"Error al recuperar los carritos"});

    }
});

// GET ONE
router.get("/:id", async (req, resp) => {
    try {
        const id = req.params.id;
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
        resp.status(200).send({message: "Carrito agregado"})
        res.json({state:"success",data:result});
    }
    catch(error){
        resp.status(500).send({message: "No pudo crearse el carrito, una pena", error:error.message})
    }
    
})
// Agrego item a un carrito, Item{prod, cantidad}
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

// hasta aca debo tener un carrito creado, ahora busco en ese carrito un itemProdu que contenga el producto
// si lo encuentro le sumo uno sino lo agrego a la lista de items para el carrito

    function addItemCart(cart, product){
        const indexItem = cart.itemsProducts.findIndex((element) => element.productId === product.id);
        if(indexItem!=-1){
            cart.itemsProducts[indexItem].quantity = cart.itemsProducts[indexItem].quantity+1;
        }else{
            cart.getItemsProducts.push({productId:product.id, quantity:1})
        }

        return cart;
    }

export {router as cartRoutes}