config.gameId = document.getElementById("gameId")?.value;

document.addEventListener("DOMContentLoaded", () => {
    console.log("gameId obtenido:", config.gameId);
    
    const keyInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    
    if (sendButton) {
        console.log("El botón de enviar existe.");
        sendButton.addEventListener("click", function () {
            console.log("Botón de enviar clickeado");
            enviarMensaje();
        });
    } 
    
    if (keyInput) {
        keyInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                enviarMensaje();
            }
        });
    }

    const oldReceive = ws.receive;
    ws.receive = (data) => {
        mostrarMensaje(data);
        oldReceive(data);
    }
});


function enviarMensaje() {
    console.log("Intentando enviar mensaje...");
    let mensaje = {
        from: document.getElementById("username").value,
        text: document.getElementById("messageInput").value,
        gameId: ""+config.gameId
    };

    console.log("Mensaje a enviar:", mensaje);
    go(`/sendMessage/${config.gameId}`, "POST", mensaje);

    document.getElementById("messageInput").value = "";
}

function mostrarMensaje(message) {
    if (message.from) {
        console.log("Mostrando mensaje en el chat:", message);
        let chatBox = document.getElementById("chatBox");
        let mensaje = document.createElement("p");
        mensaje.textContent = `${message.from}: ${message.text}`;
        chatBox.appendChild(mensaje);
    } 
}
