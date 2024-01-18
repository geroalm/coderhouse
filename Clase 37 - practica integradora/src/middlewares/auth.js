import passport from "passport";
import { logger } from "../helpers/logger.js"
import { ProductsService } from "../service/products.service.js";
import { UsersService } from "../service/users.service.js";

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


/*
Chequea que el usuario contenga el rol que se pasa por parametro
 */
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
/* Solo continua si es producto owner (tiene rol premium y es el dueño del producto)
    o bien si es admin */ 
    //TODO: MEJORAR ESTO req.user ya deberia tener el id ?
export  const  isProductOwnerOrAdmin = ()=>{        
    return async(req,res,next)=>{    //esto es para retornarle el middleware a la ruta. 
        if(req.user.role.includes(["admin"])){
            logger.info("es admin")
            next();
            return
        }
        if(req.user.role.includes(["premium"])) // si es premium valido que sea el owner del prod
        {
            logger.info("es premium")
            const prodId = req.params.id; 
            const toDeleteProd = await ProductsService.getProductById(prodId);
            const user = await UsersService.findOne(req.user.email) 
            console.log(`prod a eliminar owner = ${toDeleteProd.owner} \n userID = ${user._id}`);
            if(toDeleteProd.owner && String.toString(toDeleteProd.owner) === String.toString(user._id)){
                next()
                return
            }
        }
            logger.info("acceso denegado a borrar producto")
            res.json({status:"error", message:"No tienes permisos para realizar la operacion"});
            return 
     
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