import { config } from "../config/config.js";
import {Command} from "commander";
let productsDao;
let cartsDao;
let usersDao;
let ticketDao;
let purchaseDao;

const program = new Command();

// Configurar commander para aceptar opciones desde la línea de comandos
program
    .option('-p, --persistence <type>', 'Tipo de persistencia: memory o mongo')
    .parse();

// Obtener el tipo de persistencia de commander o usar el valor predeterminado de config
const persistence = program.opts().persistence || config.server.persistence;

switch(persistence){
    case "memory":{
        throw new Error("Metodo de persistencia aun no implementado")
    }
    case "mongo":{
        console.log("mongo persistence");
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();

        const {ProductsManagerMongo} = await import("./mongo/productsManagerMongo.js");
        const {CartsManagerMongo} = await import("../dao/mongo/cartsManagerMongo.js");
        const {UserManagerMongo} = await import("../dao/mongo/userManagerMongo.js");
        const {TicketManagerMongo} = await import("../dao/mongo/ticketManagerMongo.js");
        const {PurchaseManagerMongo} = await import("../dao/mongo/purchaseManagerMongo.js");

        productsDao = new ProductsManagerMongo();
        cartsDao = new CartsManagerMongo();
        usersDao = new UserManagerMongo();
        ticketDao = new TicketManagerMongo();
        purchaseDao = new PurchaseManagerMongo();
        break;
    }

};

export {productsDao, cartsDao,usersDao,ticketDao,purchaseDao};