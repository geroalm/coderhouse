import path from 'path';
import { fileURLToPath } from 'url';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
import bcrypt from "bcrypt";

import multer from "multer";


//CONFIGURACION MULTER
const storage = multer.diskStorage({
    //path config
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/images"))
    },

    //file name config
    filename:function(req,file,cb){
        cb(null,`${req.body.name}-${file.originalname}`)
    }
});

//creamos la funcion middleware para subir las imagenes, que utilizaremos en las diferentes rutas
export const uploader = multer({storage});



export const createHash = (toEncryptWord)=>{
    return bcrypt.hashSync(toEncryptWord, bcrypt.genSaltSync());
 }
 
 export const isValidPassword = (password,user)=>{
     return bcrypt.compareSync(password,user.password);
 }
 