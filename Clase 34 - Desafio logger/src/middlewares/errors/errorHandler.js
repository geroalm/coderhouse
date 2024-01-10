import { EError } from "../../enums/EError.js";

/* middleware para capturar errores lanzados en la capa controller con new CustomError
    o bien para capturar erroes no controlados en el ultimo middleware
  */
export const errorHandler = (error, req,res,next)=>{
    switch (error.code) {
        case EError.DATABASE_ERROR:
            req.logger.error(error)
            res.json({status:"error", error:error.cause});
            break;

        case EError.INVALID_BODY_JSON:
            req.logger.error(error)
            res.json({status:"error", error:error.message});
            break;

        case EError.INVALID_PARAM:
            req.logger.error(error)
            res.json({status:"error", error:error.cause, message:error.message});
            break;

        default: //por si el error no es controlado (sino lo lance con new CustomError())
            req.logger.error("Error desconocido - ".concat(error))
            break;
    }
};