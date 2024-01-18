import winston from "winston";
import {__dirname} from "../utils.js";
import path from "path";
import { config } from "../config/config.js";

const currentEnv = config.server.enviroment;

const customLevels = {
    levels:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors:{
        fatal:"red",
        error:"red",
        warning:"yellow",
        info:"blue",
        http:"black",
        debug:"orange"
    }
};

winston.addColors(customLevels.colors); //seteo colores

//logger para dev
const devLogger = winston.createLogger({
    levels:customLevels.levels,
    transports:[ //transportes
        new winston.transports.Console({level:"debug"}),
    ]
});

//logger para prod
const prodLogger = winston.createLogger({
    levels:customLevels.levels,
    transports:[
        new winston.transports.Console({
            level:"info",
            json: true,
            stringify: (obj) => JSON.stringify(obj),
           }),
        new winston.transports.File({filename:path.join(__dirname,"/logs/prod.log"), level:"error"})
    ]
});

let logger;
if(currentEnv === "development"){
    logger = devLogger;
} else {
    logger = prodLogger;
}

export {logger};