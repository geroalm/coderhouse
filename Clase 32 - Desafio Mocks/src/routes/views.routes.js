import { Router } from "express";
import {chatService } from "../dao/index.js";
import { ProductsViewController } from "../controller/views/products.views.controller.js";
import { CartsViewController } from "../controller/views/carts.views.controller.js";

const router = Router();

router.get("/products", ProductsViewController.getProducts);


router.get("/realtimeproducts", (req,res)=>{
    res.render("realTime");
});

router.get("/chat", (req,res)=>{
    const chats = chatService.getChats();
    res.render("chat");
});


router.get("/carts/:cId", CartsViewController.getOne);


export {router as viewsRouter}