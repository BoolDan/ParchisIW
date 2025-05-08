/*
 * Permite enviar estado al servidor (via POST Ajax)
 * Y actualiza el estado del juego cuando llegan nuevos estados por WS
 */


function enviarEstado(){
    const estado = serializaEstado();
    go(`/sendState/${config.gameId}`, 'POST', estado);
}

document.addEventListener("DOMContentLoaded", () => {
    const oldReceive = ws.receive;
    ws.receive = (data) => {
        cargarEstadoDesdeServidor(data);
        oldReceive(data);
    }    
});

function cargarEstadoDesdeServidor(data) {    
    if (data.jugadores) {
        console.log("Deserializando estado desde el servidor:", data);
        deserializaEstado(data);
    }
}
