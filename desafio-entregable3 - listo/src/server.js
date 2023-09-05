import express from "express";

const port = 8080;
export class Server {
    constructor(productManagerFiles){
    this.http = express();
    this.service = productManagerFiles;
    this.setupRoutes();
    }

    start(){
    this.http.listen(port,()=>console.log("Servidor iniciado..."));
    }

        setupRoutes() {
        this.http.get("/products", async (req, resp) => {
            try {
                const {limit} = req.query;
                const limitNumber = parseInt(limit)
                const products = await this.service.getProducts(); 
                if(limit){
                    const productsLimited = products.slice(0,limit);
                    resp.send(productsLimited)
                 }else{
                    resp.send(products);
                 }
            } catch (error) {
                resp.send(error.message);
            }
        });

        this.http.get("/products/:pid", async (req, resp) => {
            try {
                const id = req.params.pid;
                const producto = await this.service.getProductById(id);
                resp.send(producto);       
            } catch (error) {
                resp.send(error.message);
            }
        });

        }



}