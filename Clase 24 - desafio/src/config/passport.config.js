 import passport from "passport";
 import localStrategy from "passport-local";
 import {createHash, isValidPassword} from "../utils.js";
 import { usersModel } from "../dao/mongo/models/security/users.model.js";
 import {config} from "./config.js"
 import GitHubStrategy from "passport-github2"



 export const initializePasswort = ()=>{

    //Estrategia registro con github
    passport.use("signupGithubStrategy",new GitHubStrategy(
        {
            clientID:"Iv1.2051dc0535756a33",
            clientSecret: config.github.clientSecret,
            callBackURL:"http://localhost:8080/api/sessions"+config.github.callbackUrl  
        },
        async function(accessToken, refreshToken, profile, cb) {
            try {
                // console.log("profile",profile);
                const user = await usersModel.findOne({email:profile.username});
                if(user){
                    console.log("usuario ya registrado: Datos del usuario: ",user);
                    //el usuario ya esta registrado
                    return cb(null,user);
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
                console.log(newUser);
                const userCreated = await usersModel.create(newUser);
                return cb(null,userCreated);
            } catch (error) {
                return cb(error)
            }
          }
        
    ));



    //defino estrategia para registrar usuarios
    passport.use("signUpLocalStrategy", new localStrategy( // defino el middleware , recibe un objeto y un metodo
        {
            passReqToCallback:true,
            usernameField:"email"   //describo el nombre del campo que contendra el username
            
        },
        async (req,username,password,done)=>{
            const {first_name} = req.body
            console.log("passport trabajando en el signup, datos recibidos: usuario: ",username, " Password: ",password);
            try {
                const user = await usersModel.findOne({email:username});
                if(user){    //Si el usuario ya existe
                    console.log("USUARIO YA REGISTRADO ",user);
                    return done(null,false); 
                }

                    const newUser = {
                        provider:"local",
                        first_name,
                        email:username,
                        password:createHash(password)
                        
                    };
                    console.log(newUser);
                    const userCreated = await usersModel.create(newUser);

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
                const user = await usersModel.findOne({email:username});
                if(!user){
                    console.log("no user exists");
                    //el usuario no esta registrado
                    return done(null,false);
                }
                if(!isValidPassword(password,user)){
                    console.log("password no valida");
                    return done(null,false);
                }
                //validamos que el usuario esta registrado y que la contrase;a es correcta
                console.log("login ok");
                return done(null,user);
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
        const user = await usersModel.findById(id);
        done(null,user); //req.user  = informacion del usuario que traemos de la base de datos
     })
 }


