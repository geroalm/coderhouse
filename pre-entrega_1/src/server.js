import express from "express";
import { productRoutes } from "./routes/products.routes.js";
import { cartRoutes } from "./routes/carts.routes.js";
const port = 8080;
export class Server {
    constructor(){
    this.http = express();
    this.setupRoutes(); //seteo las rutas y demas middlewares
    }
    start(){
    this.http.listen(port,()=>console.log("Servidor iniciado..."));
    }

    setupRoutes() { 
        this.http.use(express.static("public"))
        this.http.use(express.json())
        this.http.use(express.urlencoded({ extended: true }))
        
        this.http.use("/api/products/",productRoutes);
        this.http.use("/api/carts/",cartRoutes);
        }



}