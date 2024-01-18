import { Server } from "socket.io";
import { chatService } from "./dao/index.js";
import { ProductsService } from "./service/products.service.js";
import { logger } from "./helpers/logger.js";

export class SocketController {
    constructor(http) {
        this.io = new Server(http);
        this.configure();
    }

    configure() {
        logger.info("preparando socket");
        this.io.on("connection", async (socket) => {         //NUEVA CONEXION
            logger.info("cliente conectado: ID = ", socket.id);
            const options = {
                limit:3 ,
                page:1,
                lean:true
            }
            // para que ante la nueva conexion le reenvie todos los productos a ese socket especifico
            const products = await ProductsService.getProducts(null,options);
            socket.emit("productsList", products);


            //recibir el producto del socket del cliente
            socket.on("addProduct", async (productData) => {
                try {
                    const result = await ProductsService.createProduct(productData)
                    const products = await ProductsService.getProducts();
                    this.io.emit("productsList", products); // envio la lista a todos los socket    
                }

                catch (error) {
                    logger.error(error);
                    throw new Error ("error al intentar agregar un producto")
                }
            });

            
            socket.on("deleteProduct", async (id) => {
                logger.info("Eliminar Producto: ",id);
                const result = await ProductsService.deleteProduct(id);
                const products = await ProductsService.getProducts();
                this.io.emit("productsList", products); // envio la lista a todos los socket
            });
            socket.on("newLogin", async (user)=>{
                socket.broadcast.emit("newUserBroadcast",user+" se ha unido al chat");
                socket.emit("chatHistory",await chatService.getChats());
            });
            socket.on("msgChat", async(chat)=>{
               await chatService.addChatMessage(chat); // agrego a la coleccion el chat
                this.io.emit("chatHistory",await chatService.getChats());
            })

            socket.on("getPage", async(options)=>{
                const products = await ProductsService.getProducts(null,options);
                this.io.emit("productsList",products);
             })


        });
    }

}