import { CoderServer } from "./server.js";

const server = new CoderServer();
server.start();
await server.conectMongoDB();
