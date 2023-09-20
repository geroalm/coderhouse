import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { productRoutes } from "./routes/products.routes.js";
import { cartRoutes } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { engine } from "express-handlebars";
import { SocketController } from "./socketController.js";

const port = 8080;
let server;
let socketController;
export class CoderServer {
    constructor(){
    this.io = null;
    this.http = express();              //express
    this.configureTemplates();      // handlebars
    this.setupRoutes();                 //seteo las rutas y demas middlewares
    }
    
    start(){
    server = this.http.listen(port,()=>console.log("Servidor iniciado..."));
    socketController = new SocketController(server);
    }

    setupRoutes() { 
        this.http.use(express.static(path.join(__dirname,"/public"))); // Carpeta publica
        this.http.use(express.json())
        this.http.use(express.urlencoded({ extended: true }))
        
        this.http.use("/api/products/",productRoutes);
        this.http.use(viewsRouter);
        this.http.use("/api/carts/",cartRoutes);


        }
        

    configureTemplates(){
        this.http.engine('.hbs', engine({extname: '.hbs'}));
        this.http.set('view engine', '.hbs');
        this.http.set('views', path.join(__dirname,"/views"));
    }

}