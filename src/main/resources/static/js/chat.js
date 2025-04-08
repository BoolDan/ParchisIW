document.addEventListener("DOMContentLoaded", () => {
    let socket = new SockJS('/ws');
    let stompClient = Stomp.over(socket);
    let gameId = document.getElementById("gameId")?.value;

    console.log("gameId obtenido:", gameId); // Verifica si gameId se obtiene correctamente

    stompClient.connect({}, function (frame) {
        console.log('Conectado a WebSocket:', frame); // Verifica si la conexión al WebSocket es exitosa

        // Suscribirse al canal público de la partida
        stompClient.subscribe(`/topic/game/${gameId}`, function (message) {
            console.log("Mensaje recibido del servidor:", message.body); // Verifica si se reciben mensajes del servidor
            mostrarMensaje(JSON.parse(message.body));
        });

        document.getElementById("sendButton").addEventListener("click", enviarMensaje);
    });

    function enviarMensaje() {
        let mensaje = {
            sender: document.getElementById("username")?.value,
            text: document.getElementById("messageInput")?.value,
            gameId: gameId
        };

        console.log("Mensaje a enviar:", mensaje); // Verifica el contenido del mensaje antes de enviarlo

        stompClient.send(`/app/chat.sendMessage/${gameId}`, {}, JSON.stringify(mensaje));
        document.getElementById("messageInput").value = "";
    }

    function mostrarMensaje(message) {
        console.log("Mostrando mensaje en el chat:", message); // Verifica el mensaje que se muestra en el chat
        let chatBox = document.getElementById("chatBox");
        let mensaje = document.createElement("p");
        mensaje.textContent = `${message.from}: ${message.text}`;
        chatBox.appendChild(mensaje);
    }
});