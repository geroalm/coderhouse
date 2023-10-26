import { Router } from "express";
import passport from "passport";
import {config} from "../config/config.js"


const router = Router();

router.post("/signup", passport.authenticate("signUpLocalStrategy",{
    failureRedirect:"/api/sessions/fail-signup"
} ) ,async(req,res)=>{
    res.render("loginView",{message:"Usuario registrado correctamente"});

});


router.get("/fail-signup",(req,res)=>{
    res.render("loginView",{error:"El usuario no ha podido registrarse"})
})


router.post("/login",  passport.authenticate("loginLocalStrategy",{   // failureRedirect:"/api/sessions/fail-login"
    failureRedirect:"/login"
}) , async(req,res)=>{
    res.redirect("/profile");
});

router.get("/logout", async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err) return res.render("profileView",{error:"No se pudo cerrar la sesion"});
            res.redirect("/login");
        })
    } catch (error) {
        res.render("signupView",{error:"No se pudo registrar el usuario"});
    }
});

//rutas de solicitud de registro con GITHUB

router.get("/signup-github", passport.authenticate("signupGithubStrategy"));


//ruta de callback
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect:"/api/sessions/fail_signup"
}), (req,res)=>{
    res.redirect("/profile");
});

export {router as sessionsRouter};