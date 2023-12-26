import { generateToken } from "../utils.js";
import {UserDto} from "../dao/dto/userDTO.js"
export class SessionController {


    static signUpLocal = async (req, res) => {
        res.render("loginView", { message: "Usuario registrado correctamente" });
    };


    static loginLocal = async (req, res) => { // login ok, genero token
        console.log("logueado como "+req.user);
        const token = generateToken(req.user);
        res.cookie("jwtToken", token).
            json({ status: "success", message: "Login exitoso" })
    };

static logOut = async (req, res) => {
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
};

static currentData = (req,res)=>{
    const userDto = new UserDto(req.user);

    res.json({status:"success",message:"Peticion valida", data:userDto});
}


}