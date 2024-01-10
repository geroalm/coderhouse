import {logger} from "../helpers/logger.js"

const loggerFilter = (req,res,next)=>{
    
    req.logger = logger;
    const user = req.user || 'No Loged'
    logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()} Usuario: ${user}`)

    next()
}
export {loggerFilter};