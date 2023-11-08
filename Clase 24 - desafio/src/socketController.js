import { Server } from "socket.io";
import { chatService, productsService } from "./dao/index.js";


export class SocketController {
    constructor(http) {
        this.io = new Server(http);
        this.configure();
    }

    configure() {
        console.log("preparando socket");
        this.io.on("connection", async (socket) => {         //NUEVA CONEXION
            console.log("cliente conectado: ID = ", socket.id);
            const options = {
                limit:3 ,
                page:1,
                lean:true
            }
            // para que ante la nueva conexion le reenvie todos los productos a ese socket especifico
            const products = await productsService.getProducts(null,options);
            socket.emit("productsList", products);


            //recibir el producto del socket del cliente
            socket.on("addProduct", async (productData) => {
                console.log("server recibio un addProduct desde Client");
                try {
                    const result = await productsService.createProduct(productData)
                    console.log("resultado: ",result);
                    const products = await productsService.getProducts();
                    this.io.emit("productsList", products); // envio la lista a todos los socket    
                }

                catch (error) {
                    console.log(error);
                    throw new Error ("error al intentar agregar un producto")
                }
            });

            
            socket.on("deleteProduct", async (id) => {
                console.log("Eliminar Producto: ",id);
                const result = await productsService.deleteProduct(id);
                const products = await productsService.getProducts();
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
                const products = await productsService.getProducts(null,options);
                this.io.emit("productsList",products);
             })


        });
    }

}