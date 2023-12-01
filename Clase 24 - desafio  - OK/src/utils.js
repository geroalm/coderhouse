import path from 'path';
import { fileURLToPath } from 'url';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
import bcrypt from "bcrypt";
import multer from "multer";
import jwt from "jsonwebtoken"
import { config } from './config/config.js';


//CONFIGURACION MULTER
const storage = multer.diskStorage({
    //path config
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"))
    },

    //file name config
    filename: function (req, file, cb) {
        cb(null, `${req.body.name}-${file.originalname}`)
    }
});

//creamos la funcion middleware para subir las imagenes, que utilizaremos en las diferentes rutas
export const uploader = multer({ storage });



export const createHash = (toEncryptWord) => {
    return bcrypt.hashSync(toEncryptWord, bcrypt.genSaltSync());
}

export const isValidPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
}


export const generateToken = (user) => {
    const token = jwt.sign({ first_name: user.first_name, email: user.email,role:user.role },
        config.server.secretTokenKey,
        { expiresIn: "24h" });

    return token;
};

export const validateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // console.log(authHeader);
    if (!authHeader) return res.sendStatus(401);

    //se hace el split ya que el token viene en el header de la siguiente manera: "Bearer <token>", y solo nos interesa el token
    const token = authHeader.split(" ")[1];
    // console.log(token);

    if (token === null) return res.sendStatus(401);

    //jwt.verify toma como argumentos:
    //1. El token recibido
    //2. La clave privada, que es la que usamos antes para firmar el token.
    //3. Un callback que se ejecutará cuando el token sea verificado.
    //De esta manera verificamos que el token sea válido y que no haya sido modificado externamente, y lo agregamos al objeto request para que pueda ser usado en las rutas.
    jwt.verify(token, PRIVATE_KEY, (err, payload) => {
        if (err) return res.sendStatus(403);
        req.user = payload;
        next();
    });
};
