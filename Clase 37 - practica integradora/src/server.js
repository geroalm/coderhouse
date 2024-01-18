import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { productRoutes } from "./routes/products.routes.js";
import { cartRoutes } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { engine } from "express-handlebars";
import { SocketController } from "./socketController.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { viewsLoginRouter } from "./routes/views.login.routes.js";
import passport from "passport";
import { initializePasswort } from "./config/passport.config.js";
import { config } from "./config/config.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errors/errorHandler.js";
import { loggerFilter } from "./middlewares/loggerMiddleware.js";
import { userRouter } from "./routes/admin.routes.js";


const port = config.server.port;
let server;
let socketController;
export class CoderServer {

    constructor() {
        this.io = null;
        this.http = express();           //express
        this.configureTemplates();      // handlebars
        this.setupRoutesAndMiddleware(); //seteo las rutas y demas middlewares

    }

    start() {
        server = this.http.listen(port, () => console.log(`Servidor iniciado... puerto:${port}`));
        socketController = new SocketController(server);
    }

    setupRoutesAndMiddleware() {


        //Configuracion passport

        initializePasswort();
        this.http.use(passport.initialize());
        // this.http.use(passport.session());
        this.http.use(cookieParser());

        this.http.use(express.static(path.join(__dirname, "/public"))); // Carpeta publica
        this.http.use(express.json())
        this.http.use(express.urlencoded({ extended: true }))

        this.http.use(loggerFilter)
        this.http.use("/api/products/", productRoutes);
        this.http.use("/views", viewsRouter);
        this.http.use("/api/carts/", cartRoutes);

        this.http.use("/api/sessions", sessionsRouter);
        this.http.use("/api/admin/users", userRouter);
        this.http.use(viewsLoginRouter);

        this.http.use(errorHandler); //manejo de errores

    }

    configureTemplates() {
        this.http.engine('.hbs', engine({
            extname: '.hbs', runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true
            }
        }));

        this.http.set('view engine', '.hbs');
        this.http.set('views', path.join(__dirname, "/views"));
    }




}