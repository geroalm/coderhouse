import { ProductManagerFiles } from "./productManagerFiles.js";
import { CartManagerFiles } from "./cartsManagerFile.js";
import { __dirname } from "../utils.js";
import path from "path";

export const productsService = new ProductManagerFiles(path.join(__dirname,"/files/productsFile.json"));
export const cartsService = new CartManagerFiles(path.join(__dirname,"/files/cartsFile.json"));
