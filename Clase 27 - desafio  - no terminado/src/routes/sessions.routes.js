import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js"
import { generateToken } from "../utils.js";


const router = Router();

router.post("/signup", passport.authenticate("signUpLocalStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), async (req, res) => {
    res.render("loginView", { message: "Usuario registrado correctamente" });

});


router.get("/fail-signup", (req, res) => {
    res.render("loginView", { error: "El usuario no ha podido registrarse" })
})


router.post("/login", passport.authenticate("loginLocalStrategy", {   // failureRedirect:"/api/sessions/fail-login"
    session: false,
    failureRedirect: "/login"
}), async (req, res) => { // login ok, genero token

    const token = generateToken(req.user);
    res.cookie("jwtToken", token).
        json({ status: "success", message: "Login exitoso" })

});



router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("jwtToken")
        req.session.destroy(err => {
            if (err) return res.render("profileView", { error: "No se pudo cerrar la sesion" });
            res.redirect("/login");
        })
        res.clearCookie("jwtToken")
    } catch (error) {
        res.render("signupView", { error: "No se pudo registrar el usuario" });
    }
});

//rutas de solicitud de registro con GITHUB

router.get("/signup-github", passport.authenticate("signupGithubStrategy"));


//ruta de callback
router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail_signup"
}), (req, res) => {
    res.redirect("/profile");
});



router.get("/current", passport.authenticate("current", {
    session:false,
    failureRedirect:"/api/sessions/fail-auth"
}) , (req,res)=>{
    res.json({status:"success",message:"Peticion valida", data:req.user});
});


router.get("/fail-login", (req,res)=>{
    res.render("login",{error:"No se pudo iniciar sesion para el usuario"});
});

router.get("/fail-auth",(req,res)=>{
    res.json({status:"error", message:"token invalido"});
});


export { router as sessionsRouter };