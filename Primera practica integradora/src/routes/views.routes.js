import { Router } from "express";
import { chatService, productsService } from "../dao/index.js";

const router = Router();

router.get("/", async(req,res)=>{
    const products = await productsService.getProducts(true);
    console.log("products",products);
    res.render("home",{products:products});
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTime");
});
router.get("/chat", (req,res)=>{
    const chats = chatService.getChats();
    res.render("chat");
});

export {router as viewsRouter}