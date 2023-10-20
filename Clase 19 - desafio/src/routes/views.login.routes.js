import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    console.log("RUTA /home");
    res.render("home");
});

router.get("/signup",(req,res)=>{
    res.render("signupView");
});

router.get("/login",(req,res)=>{
    console.log("RUTA /login");
    res.render("loginView");
});

router.get("/profile",(req,res)=>{
    console.log("RUTA /profile");
    if(req.session?.email){
        const email = req.session.email;
        const role = req.session.role;
        const user ={email:email, role:role};

        res.render("profileView",{user});
    } else {
        console.log("REDIRECT /login");
        res.redirect("/login");
    }
});

export { router as viewsLoginRouter};