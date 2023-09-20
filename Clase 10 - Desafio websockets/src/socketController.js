import { Server } from "socket.io";
import { productsService } from "./persistence/index.js";
import fs from "fs"

export class SocketController {
    constructor(http) {
        this.io = new Server(http);
        this.configure();
    }

    configure() {
        console.log("preparando socket");
        this.io.on("connection", async (socket) => {         //NUEVA CONEXION
            console.log("cliente conectado: ID = ", socket.id);
            // para que ante la nueva conexion le reenvie todos los productos a ese socket especifico
            const products = await productsService.getProducts(true);
            socket.emit("productsList", products);


            //recibir el producto del socket del cliente
            socket.on("addProduct", async (productData) => {
                console.log("server recibio un addProduct desde Client");
                const result = await productsService.addProduct(productData)
                const products = await productsService.getProducts(true);
                this.io.emit("productsList", products); // envio la lista a todos los socket
            });

            //recibir el producto del socket del cliente
            socket.on("deleteProduct", async (idProduct) => {
                console.log("Eliminar Producto");
                
                const result = await productsService.deleteProductById(idProduct);
                const products = await productsService.getProducts(true);
                this.io.emit("productsList", products); // envio la lista a todos los socket
            });


        });
    }

}