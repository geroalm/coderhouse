import { config } from "./config.js"
import nodemailer from 'nodemailer';

//creo configuro y exporto transporter
export const transporter = nodemailer.createTransport({
    service:'gmail',
    port:'587',
    auth:{
        user:config.email.account,
        pass:config.email.password
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})


