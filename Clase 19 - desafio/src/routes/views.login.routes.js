import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    console.log("RUTA login/home");
    res.render("home");
});

router.get("/signup",(req,res)=>{
    res.render("signupView");
});

router.get("/login",(req,res)=>{
    console.log("RUTA login/login");
    res.render("loginView");
});

router.get("/profile",(req,res)=>{
    console.log("RUTA /login/profile");
    if(req.session?.email){
        const userEmail = req.session.email;
        res.render("profileView",{userEmail});
    } else {
        console.log("REDIRECT /login");
        res.redirect("/login/login");
    }
});

export { router as viewsLoginRouter};