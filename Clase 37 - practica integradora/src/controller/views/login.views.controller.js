import { UsersService } from "../../service/users.service.js"
import { sendRecoveryEmailPassword, generateEmailToken, validateEmailToken, decodeToken } from "../../helpers/email.js";
import { logger } from "../../helpers/logger.js";
import { isValidPassword, createHash } from "../../utils.js"

export class LoginController {

    //forgot password controller
    /*recibo el get desde el swagger con el dato del email que intenta recuperar*/
    static forgot = async (req, res) => {
        try {
            const email = req.query.email;
            if (!email || !await UsersService.findOne(email)) {
                res.render("resetPassword", { error: "Tuvimos problemas para encontrar tu usuario, contancta a un administrador" })
                return;
            }
            const token = generateEmailToken(email, 3000) // genero un token 
            await sendRecoveryEmailPassword(req, email, token) // envio mail, 
            res.render("resetPassword", { message: "Revisa tu correo, te enviamos informacion para recuperar el acceso a ella" })

        }
        catch (error) {
            logger.info("error al intentar recuperar contraseña")
            console.log(error);
        }


    }
    /* Recibe el token, lo valido y llamo a la vista para cambiar password
        Controla que el token sea valido}
        */
    static emailValidate = async (req, res) => { // antes de enviarlo a la vista valido el token
        const token = req.query.token;
        try {
            const data = validateEmailToken(token);
            res.render("newPassword", { message: "Cambio de contraseña", token: token })
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.info("Intento de reestablecer cuenta, token vencido")

                const content = decodeToken(token);
                res.render("resetPassword", { error: `El token ha expirado, intenta volver a <a href="/forgot?email=${content.email}" >solicitar un email</a>` });
            } else {
                console.log(error);
                res.render("resetPassword", { error: "No se pudo recuperar la cuenta, contacta a un administrador" });
            }

        }

    }
    //controller para la vista newPassword
    static resetPassword = async (req, res) => {
        /*  - reviso parametros password y passwordrp
            - que sean iguales
            - reviso que la clave actual no sea igual a la nueva
            - cambio password
        */
        const pass = req.body.password
        const passrp = req.body.passwordrp
        const token = req.query.token
        if (!pass || !passrp || pass != passrp) { //las claves son iguales?
            console.log(pass," ",passrp)
            res.render("newPassword", { error: "Las claves no coinciden", token })
            return
        }

        try {
            const data = validateEmailToken(token);
            const user = await UsersService.findOne(data.email); //traigo el usuario
            console.log(`comparando nueva clave`);
             if (isValidPassword(pass, user)) {   //valido que la clave nueva y la antigua no sean iguales
                res.render("resetPassword", { error: "No se pudo cambiar la contraseña, prueba con otra contraseña o contacta a un administrador",token });
                return;
            }
            user.password = createHash(pass);
            await UsersService.updateById(user._id, user) 
            logger.info("cambio de contraseña exitoso ",user.email)
            res.render("loginView");

        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                logger.info("Intento de reestablecer cuenta, token vencido")

                const content = decodeToken(token);
                res.render("resetPassword", { error: `tiempo expirado, intenta volver a <a href="/forgot?email=${content.email}" >solicitar un email</a>` });
            } else {
                logger.error(error);
                res.render("resetPassword", { error: "No se pudo recuperar la cuenta, contacta a un administrador" });
            }
        }

    }
}