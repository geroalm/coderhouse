import dotenv from "dotenv";
import {Command} from "commander";


//PARAMETROS COMMANDER
const program = new Command();
// Configurar commander para aceptar parametros desde la línea de comandos
program
    .option('-p, --persistence <type>', 'Tipo de persistencia: memory o mongo')
    .option('-env, --enviroment <type>','Entorno de ejecucion: develompent o production')
    .parse();


const {enviroment, persistence} = program.opts(); 

//VARIABLES DE ENTORNO
dotenv.config({ //segun parametro levanto .env.dev o .env.prod, esto carga las variables en process.env
    path:enviroment==="production"?'.env.prod':'.env.dev'
}); 



export const config = {
    server:{
        secretSession:process.env.SECRET_SESSION,
        secretTokenKey:process.env.PRIVATE_KEY,
        persistence:persistence || process.env.PERSISTENCE, // reviso si hay algun parametro, sino uso env
        enviroment:enviroment || process.env.ENVIROMENT,
        port:process.env.PORT
    },
    mongo:{
        url: process.env.MONGO_URL
    },
    github:{
        clientUrl: process.env.GITHUB_CALLBACK_URL,
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: process.env.GITHUB_CALLBACK_URL

    },
    email:{
        account:process.env.ADMIN_EMAIL,
        password:process.env.ADMIN_PASSWORD,
        secretKey:process.env.SECRET_EMAIL_KEY
    }
}