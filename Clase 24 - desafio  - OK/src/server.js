import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { productRoutes } from "./routes/products.routes.js";
import { cartRoutes } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { engine } from "express-handlebars";
import { SocketController } from "./socketController.js";
import { connectDB } from "./config/dbCOnnection.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { viewsLoginRouter } from "./routes/views.login.routes.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { initializePasswort } from "./config/passport.config.js";
import {config} from "./config/config.js";
import cookieParser from "cookie-parser";




const port = 8080;
let server;
let socketController;
export class CoderServer {
    
    constructor(){
    this.io = null;
    this.http = express();              //express
    this.configureTemplates();      // handlebars
    this.setupRoutesAndMiddleware();                 //seteo las rutas y demas middlewares

}
    
    start(){

    server = this.http.listen(port,()=>console.log("Servidor iniciado..."));
    socketController = new SocketController(server);

    }

    setupRoutesAndMiddleware() {


//configuración de session
this.http.use(session({ // agrego a express el requestHandler que devuelve la funcion session()
    store: MongoStore.create({
        ttl:3000, // se resetea por cada peticion, si pasan los 3000 mongoStore se encarga de gestionar la eliminacion
        mongoUrl:config.mongo.url,
    }),
    secret:config.server.secretSession,
    resave:true,
    saveUninitialized:true
}));

        //Configuracion passport

        initializePasswort();
        this.http.use(passport.initialize());
        this.http.use(passport.session());
        this.http.use(cookieParser());

        
        this.http.use(express.static(path.join(__dirname,"/public"))); // Carpeta publica
        this.http.use(express.json())
        this.http.use(express.urlencoded({ extended: true }))
        
        this.http.use("/api/products/",productRoutes);
        this.http.use("/views",viewsRouter);
        this.http.use("/api/carts/",cartRoutes);

        this.http.use("/api/sessions", sessionsRouter);
        this.http.use(viewsLoginRouter);


        }
        
        configureTemplates(){
            this.http.engine('.hbs', engine({extname: '.hbs',runtimeOptions: {
                  allowProtoPropertiesByDefault: true,
                  allowProtoMethodsByDefault: true
                }}));
    
            this.http.set('view engine', '.hbs');
            this.http.set('views', path.join(__dirname,"/views"));
        }



    async conectMongoDB(){
        console.log("intentando conectar a la base MongoDB");
        await connectDB();
    }

}