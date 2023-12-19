import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js"
import { SessionController } from "../controller/SessionController.js";


const router = Router();

router.post("/signup", passport.authenticate("signUpLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionController.signUpLocal);


router.get("/fail-signup", (req, res) => {
    res.render("loginView", { error: "El usuario no ha podido registrarse" })
})


router.post("/login", passport.authenticate("loginLocalStrategy", {   // failureRedirect:"/api/sessions/fail-login"
    session: false,
    failureRedirect: "/login"
}), SessionController.loginLocal);



router.get("/logout", SessionController.logOut);

//rutas de solicitud de registro con GITHUB

router.get("/signup-github", passport.authenticate("signupGithubStrategy"));


//ruta de callback
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail_signup"
}), //(req, res) => {
   // res.redirect("/profile"); 
   SessionController.loginLocal // uso el mismo metodo que en signupLocal para manejar el token de la sesion
//}
);


router.get("/current", passport.authenticate("current", {
    session:false,
    failureRedirect:"/api/sessions/fail-auth"
}) , SessionController.currentData);


router.get("/fail-login", (req,res)=>{
    res.render("login",{error:"No se pudo iniciar sesion para el usuario"});
});

router.get("/fail-auth",(req,res)=>{
    res.json({status:"error", message:"token invalido"});
});

router.get("/noAuth",(req,res)=>{   
    res.json({status:"error", message:"Usuario no autenticado"});
});


export { router as sessionsRouter };