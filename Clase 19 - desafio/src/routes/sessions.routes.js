import { Router } from "express";
import { usersModel } from "../dao/mongo/models/security/users.model.js";

const router = Router();

router.post("/signup", async(req,res)=>{
    try {
        console.log("RURA /api/session/signup -> session.route");
        const signupForm = req.body;
        const result = await usersModel.create(signupForm);
        res.render("loginView",{message:"Usuario registrado correctamente"});
    } catch (error) {
        res.render("signupView",{error:"No se pudo registrar el usuario"});
    }
});

router.post("/login", async(req,res)=>{
    try {
        const loginForm = req.body;
        const user = await usersModel.findOne({email:loginForm.email});
        if(!user || user.password !== loginForm.password){
            return res.render("loginView",{error:"Credenciales invalidas"});
        }
        //ususario existe y contraseña valida, entonces creamos la session del usuario
        req.session.email = user.email;
        res.redirect("/profile");
    } catch (error) {
        console.log(error);
        res.render("loginView",{error:"No se pudo iniciar sesion para este usuario"});
    }
});

router.get("/logout", async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err) return res.render("profileView",{error:"No se pudo cerrar la sesion"});
            res.redirect("/");
        })
    } catch (error) {
        res.render("signupView",{error:"No se pudo registrar el usuario"});
    }
});

export {router as sessionsRouter};