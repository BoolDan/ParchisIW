config.gameId = document.getElementById("gameId")?.value;

document.addEventListener("DOMContentLoaded", () => {
    console.log("gameId obtenido:", config.gameId);
    
    const sendButton = document.getElementById("sendButton");
    if (sendButton) {
        console.log("El botón de enviar existe.");
        sendButton.addEventListener("click", function () {
            console.log("Botón de enviar clickeado");
            enviarMensaje();
        });
    } else {
        console.log("El botón de enviar no se encontró.");
    }

    ws.receive = mostrarMensaje;
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
}

function mostrarMensaje(message) {
    console.log("Mostrando mensaje en el chat:", message);
    let chatBox = document.getElementById("chatBox");
    let mensaje = document.createElement("p");
    mensaje.textContent = `${message.from}: ${message.text}`;
    chatBox.appendChild(mensaje);
}
