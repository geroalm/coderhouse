import { Server } from './server.js'; // Asegúrate de ajustar la ruta al archivo server.js
import { ProductManagerFiles } from './productManagerFiles.js';

const productManager = new ProductManagerFiles("./files/productos.json");
const server = new Server(productManager);
server.start();
