import passport from "passport";
import { logger } from "../helpers/logger.js"

export const isAuth = (req, res, next) => { //middleware para chequear si esta logeado
    passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/noAuth" })
    (req, res, (err) => {   //aca hago la llamada al middleware y le paseo req res y una callback
        if (err || !req.user) {
            // No autenticado 
            logger.warning("Usuario no autenticado")
            return res.redirect("/api/sessions/noAuth");
        }

        // Usuario autenticado disponible en req.user
        next();
    });
};



export const checkRole = (roles)=>{         //roles ej = ["admin"]
    return (req,res,next)=>{    //esto es para retornarle el middleware a la ruta. 
        if(!roles.includes(req.user.role)){
            req.logger.info("acceso denegado a la ruta /admin para",req.user.email)
            res.json({status:"error", message:"No tienes permisos para realizar la operacion"});
            return 
        } else {
            next();
        }
    }
};

/* Reviso que el usuario sea dueño del carrito que intenta modificar */
export const isCartOwner = ()=>{         //roles ej = ["admin"]
    return (req,res,next)=>{    //esto es para retornarle el middleware a la ruta donde se utiliza. 
        let cart = req.params.cId;
        console.log(req.user.cart);
        if(req.user.cart === cart){
            next()
        }
        else
        res.status(403).send({ message: "Acceso denegado al carrito " });
    
    }
};