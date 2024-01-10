 import passport from "passport";
 import localStrategy from "passport-local";
 import {createHash, isValidPassword} from "../utils.js";
 import { UsersService } from "../service/users.service.js";
 import {config} from "./config.js"
 import GitHubStrategy from "passport-github2"
 import jwt from "passport-jwt";


 export const initializePasswort = ()=>{

    const JWTStrategy = jwt.Strategy;
    const extractJwt = jwt.ExtractJwt; //Extraer el token (cookie,query params, body, headers)

    //Estrategia registro con github
    passport.use("signupGithubStrategy",new GitHubStrategy(
        {
            clientID:"Iv1.2051dc0535756a33",
            clientSecret: config.github.clientSecret,
            callBackURL:"http://localhost:8080/api/sessions"+config.github.callbackUrl  
        },
        async function(accessToken, refreshToken, profile, cb) {
            try {
                const user = await UsersService.findOne(profile.username);
                if(user){ // usuario ya registrado
                    console.log("usuario ya registrado: Datos del usuario: ",user);
                    return cb(null,user); // retorno null y el usuario (null porque no hay error)
                }
                //El usuario no esta registrado
                const newUser = {
                    first_name:profile._json.name,
                    provider:profile.provider,
                    provider_id: profile.provider_id?provider_id:"",
                    photo:profile.photo,
                    email:profile.username,
                    password:createHash(profile.id)
                };
                const userCreated = await UsersService.create(newUser);
                return cb(null,userCreated);
            } catch (error) {
                return cb(error)
            }
          }
        
    ));

    //defino estrategia para registrar usuarios locales
    passport.use("signUpLocalStrategy", new localStrategy( // defino el middleware , recibe un objeto y un metodo
        {
            passReqToCallback:true,
            usernameField:"email"   //describo el nombre del campo que contendra el username
            
        },
        async (req,username,password,done)=>{

            const {first_name, last_name, role} = req.body

            console.log("passport trabajando en el signup, datos recibidos: usuario: ",username, " Password: ",password);
            try {
                const user = await UsersService.findOne(username);
                if(user){    //Si el usuario ya existe
                    console.log("USUARIO YA REGISTRADO ",user);
                    return done(null,false); 
                }

                    const newUser = {
                        provider:"local",
                        first_name,
                        last_name,
                        role,
                        email:username,
                        password:createHash(password)
                        
                    };
                    console.log(newUser);
                    const userCreated = await UsersService.create(newUser);

                    return done(null,userCreated);
            } catch (error) {
                return done(error)
            }

        }
    ));
     //Estrategia para login a los usuarios
     passport.use("loginLocalStrategy", new localStrategy(
        {
            usernameField:"email", //ahora el campo username es igual al campo email
        },
        async (username,password,done)=>{
            try {
                const user = await UsersService.findOne(username);
                if(!user){ //el usuario no esta registrado
                    console.error("no user exists");
                    return done(null,false);
                }
                if(!isValidPassword(password,user)){
                    console.error("password no valida");
                    return done(null,false);
                }
                //validamos que el usuario esta registrado y que la contrasenia es correcta
                console.log("login ok");
                return done(null,user); //req.user
            } catch (error) {
                return done(error);
            }
        }
    ));


    // datos a serializar en la sesion
    passport.serializeUser((user,done)=>{
        done(null,user._id)
     });
      passport.deserializeUser(async(id,done)=>{
        const user = await UsersService.findById(id);
        done(null,user); //req.user  = informacion del usuario que traemos de la base de datos
     })


     passport.use("current", new JWTStrategy(
        {
            //Extraer la informacion del token que se encuentra en la cookie
            jwtFromRequest:extractJwt.fromExtractors([cookieExtractor]),
            secretOrKey:config.server.secretTokenKey //clave privada para hash
        },
         (jwtPayload,done)=>{
            try {
                return done(null,jwtPayload); //req.user = info del token
            } catch (error) {
                return done(error);
            }
        }
    ));
};

//funcion para extraer el token de la cookie
const cookieExtractor = (req)=>{
    let token;
    if(req && req.cookies && typeof req.cookies['jwtToken'] !== 'undefined'){ //req?.cookies
        console.log("HAY COOKIE ",req.cookies['jwtToken']);
        token = req.cookies["jwtToken"];
    } else {
        console.log("sin cookie");
        token = null;
        return token;
    }
    return token;
};
 


