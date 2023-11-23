import { config } from "../config/config.js";
let productsDao;
let cartsDao;
let usersDao;
const persistence = config.server.persistence;

switch(persistence){
    case "memory":{
        /* const {ContactsMemory} = await import("./managers/memory/contacts.memory.js");
        // const {ProductsMemory} = await import("./managers/memory/products.memory.js");
        contactsDao = new ContactsMemory();
        // productsDao = new ProductsMemory();
        break; */
        throw new Error("Metodo de persistencia aun no implementado")
    }
    case "mongo":{
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();

        const {ProductsManagerMongo} = await import("./mongo/productsManagerMongo.js");
        const {CartsManagerMongo} = await import("../dao/mongo/cartsManagerMongo.js");
        const {UserManagerMongo} = await import("../dao/mongo/userManagerMongo.js")

        productsDao = new ProductsManagerMongo();
        cartsDao = new CartsManagerMongo();
        usersDao = new UserManagerMongo();
        break;
    }

};

export {productsDao, cartsDao,usersDao};