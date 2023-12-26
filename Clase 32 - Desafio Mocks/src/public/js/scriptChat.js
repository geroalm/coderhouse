//socket del cliente
const socketClient = io();

 const inputMsg = document.getElementById("message");
 const sendMsgBtn = document.getElementById("sendMsg");
 const chatBox = document.getElementById("chatBox");

let user;//variable de identidad del usuario
Swal.fire({
    title: 'chat',
    text: 'Por favor, ingresa tu nombre de usuario',
    input: 'text',
    inputValidator: (value)=>{
        return !value && 'Debes ingresar el nombre de usuario para continuar'
    },
    allowOutsideClick:false,
    allowEscapeKey:false
}).then((inputValue)=>{
    user = inputValue.value;
    socketClient.emit("newLogin", user);
});

sendMsgBtn.addEventListener("click",()=>{
    const msg = {user:user, message:inputMsg.value};
    socketClient.emit("msgChat", msg);
    inputMsg.value="";
});
 
socketClient.on("chatHistory", (chatHistory)=>{ //server envia historial
    let msgElements="";
    
    chatHistory.forEach(elm=>{
        msgElements += `<div class="message ${elm.user === user ? 'user-message' : 'other-message'}"><strong>${elm.user===user? 'TU':elm.user}:</strong> ${elm.message}</div>`;
    });

    chatBox.innerHTML = msgElements;
});


socketClient.on("newUserBroadcast", (data)=>{ //server envia aviso nuevo conectado
    if(user){ //si el usuario ya se autentico
        Swal.fire({
            text:data,
            toast:true,
            position:"top-right"
        });
    }
});

















