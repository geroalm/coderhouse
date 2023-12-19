import { ProductManagerFiles } from "./files/productManagerFiles.js";
import { CartManagerFiles } from "./files/cartsManagerFile.js";
import {ProductsManagerMongo} from "./mongo/productsManagerMongo.js"
import { __dirname } from "../utils.js";
import { CartsManagerMongo } from "./mongo/cartsManagerMongo.js";
import { ChatManagerMongo } from "./mongo/chatManagerMongo.js";

//export const productsService = new ProductManagerFiles(path.join(__dirname,"/files/productsFile.json"));
/* export const productsService = new ProductsManagerMongo();

export const cartsService = new CartsManagerMongo(); */

export const chatService = new ChatManagerMongo();