import { config } from "../config/config.js";
import jwt from "jsonwebtoken"
import {transporter} from "../config/email.js"
import { logger } from "./logger.js";


export const generateEmailToken=(email,expTime)=>{
    try {
         return jwt.sign({email},config.email.secretKey,{expiresIn:expTime})
    } catch (error) {
        console.log(error);
        logger.error(error)
    }

};

export const validateEmailToken = (token)=>{
   
        const content = jwt.verify(token,config.email.secretKey)
        return content

}

export const decodeToken = (token)=>{
    return  jwt.decode(token)
}

/* params: 
req = para extraer el dominio y poder generar el link hasta la ubicacion del server
email = direccion destino
token = token con tiempo de expiracion y la direccion de email 
*/
export const sendRecoveryEmailPassword=async(req, email,token)=>{
    const domain = `${req.protocol}://${req.get('host')}`
    const link = `${domain}/reset-password?token=${token}` //enlace con el token

    
    //envio mail con link
    await transporter.sendMail({
        from:"E-commerce galmeida",
        to:email,
        subject:"reestablecimiento de contraseña",
        html:`
            <div>
                <h2> Hola! </h2>
                <p> Solicitaste un reestablecimiento de contraseña, da clic en el siguiente enlace </p>
                <a href="${link}">
                 <button>
                        reestablecer password
                </button>
                </a>
            </div>
        `
    })
}