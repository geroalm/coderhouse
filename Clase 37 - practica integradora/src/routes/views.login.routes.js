import { Router } from "express";
import { LoginController } from "../controller/views/login.views.controller.js";

const router = Router();

router.get("/",(req,res)=>{
    console.log("view.login.routes");
    res.render("home");
});

router.get("/signup",(req,res)=>{
    res.render("signupView");
});

router.get("/login",(req,res)=>{
    res.render("loginView");
});

router.get("/forgot", LoginController.forgot); //ruta para enviar mail de recuperacion

router.get("/reset-password",LoginController.emailValidate);  //ruta al hacer click en el email, contiene el token

router.post("/reset-password",LoginController.resetPassword);  //ruta al hacer click en el email, contiene el token


router.get("/profile",(req,res)=>{
    if(req.user){
        const email = req.user.email;
        const role = req.user.role;
        const user ={email:email, role:role};
        res.render("profileView",{user});
    } else {
        res.redirect("/login");
    }
});


export { router as viewsLoginRouter};