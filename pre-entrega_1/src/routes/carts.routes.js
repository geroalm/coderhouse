import { Router } from "express"; //importa una funcion del modulo express
import { CartManagerFiles } from "../cartsManagerFile.js";
import { ProductManagerFiles } from '../productManagerFiles.js';
import { Cart } from "../classes/cart.js";

const router = Router();    //llama a la funcion que devuelve un Router y lo guardo en la variable router

const serviceCart = new CartManagerFiles("./files/cartsFile.json");
const serviceProd = new ProductManagerFiles("./files/productsFile.json");

router.get("/", async (req,resp)=>{
    resp.send(JSON.stringify(await serviceCart.getCarts(), null, 2))
    
})
// GET ONE
router.get("/:id", async (req, resp) => {
    try {
        const id = req.params.id;
        const cart = await serviceCart.getCartById(id);
        resp.send(cart);       
    } catch (error) {
        resp.send(error.message);
    }
});
// Creo un carrito Vacio
router.post("/",async (req,resp)=>{
    try{
        let cart = new Cart();
        await serviceCart.addCart(cart);
        resp.status(200).send({message: "Carrito agregado"})
    }
    catch(error){
        resp.status(500).send({message: "No pudo crearse el carrito, una pena", error:error.message})
    }
    
})
// Agrego item a un carrito, Item{prod, cantidad}
router.post("/:cId/products/:pId", async (req,resp)=>{
    try {
            const cId = req.params.cId; const pId = req.params.pId;
            if(!(cId && pId)) throw new Error("Error al agregar un producto al carrito");
            
            let product = await serviceProd.getProductById(pId); 
            if(!product) throw new Error("Error al agregar un producto al carrito");

            let cart = await serviceCart.getCartById(cId);
            if(!cart) throw new Error("Error al agregar un producto, carrito no encontrado");

            cart = addItemCart(cart,product);

            await serviceCart.updateCart(cart);

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