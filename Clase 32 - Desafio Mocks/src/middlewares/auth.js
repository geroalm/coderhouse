import passport from "passport";

export const isAuth = (req, res, next) => {
    passport.authenticate("current", { session: false, failureRedirect: "/api/sessions/noAuth" })
    (req, res, (err) => {   //aca hago la llamada al middleware y le paseo req re y una callback
        if (err || !req.user) {
            // No autenticado 
            return res.redirect("/api/sessions/noAuth");
        }

        // Usuario autenticado disponible en req.user
        console.log("Usuario Autenticado:", req.user);
        next();
    });
};


/* Reviso que el usuario sea dueño del carrito que intenta modificar */

export const checkRole = (roles)=>{         //roles ej = ["admin"]
    return (req,res,next)=>{    //esto es para retornarle el middleware a la ruta. 
        if(!roles.includes(req.user.role)){
            res.json({status:"error", message:"No tienes permisos para realizar la operacion"});
            return 
        } else {
            next();
        }
    }
};

export const isCartOwner = ()=>{         //roles ej = ["admin"]
    return (req,res,next)=>{    //esto es para retornarle el middleware a la ruta. 
        let cart = req.params.cId;
        console.log(req.user.cart);
        if(req.user.cart === cart){
            next()
        }
        else
        res.status(403).send({ message: "Acceso denegado al carrito " });
    
    }
};