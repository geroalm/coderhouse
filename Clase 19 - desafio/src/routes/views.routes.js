import { Router } from "express";
import { cartsService, chatService, productsService } from "../dao/index.js";

const router = Router();

router.get("/products", async(req,res)=>{
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
                docs:result.docs,
                totalPages:result.totalPages,
                prevPage:result.prevPage,
                nextPage:result.prevPage,
                page:result.page,
                hasPrevPage:result.hasPrevPage,
                hasNextPage:result.hasNextPage,
                prevLink: result.hasPrevPage?baseUrl.replace(`page=${result.page}`,`page=${result.prevPage}`):null,
                nextLink: result.hasNextPage?baseUrl.includes("page")?baseUrl.replace(`page=${result.page}`,`page=${result.nextPage}`):baseUrl.concat(`?page=${result.nextPage}`) :null
                
            }
            res.render("products",{products:dataProd,email:req.session.email});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'error', message: error.message });
        } 
});

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTime");
});
router.get("/chat", (req,res)=>{
    const chats = chatService.getChats();
    res.render("chat");
});


router.get("/carts/:cId", async(req,res)=>{
    try {
        const id = req.params.cId;
        const cart = await cartsService.getCartById(id);
        const items = cart.itemsProducts;
        console.log("ítems: ",items);
        res.render("carts",{items:items});   
    } catch (error) {
        resp.send(error.message);
    }

    
});


export {router as viewsRouter}