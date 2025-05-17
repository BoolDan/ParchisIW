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
        if (data.tipo === "nuevoJugador") {
            fetch(`/partida/${config.gameId}/jugadores`)
                .then(r => r.json())
                .then(data => {
                    config.jugadores = data;
                    console.log("Jugadores ACTUALIZADOS:", config.jugadores);
                    // refrescar tablero si es necesario
                });
        }

        // Lógica principal: si contiene estado de partida, deserialízalo
        if (data.jugadores && typeof cargarEstadoDesdeServidor === 'function') {
            cargarEstadoDesdeServidor(data);
            
        }

        if (typeof oldReceive === 'function') oldReceive(data);
    };
});


function actualizarVistaInfoPartida(data) {
    const mensajeTurno = document.getElementById("mensaje-turno");
    const jugadorActual = data.jugadores[data.jugadorActual];
    mensajeTurno.innerHTML = `<p><strong>Turno de ${jugadorActual.nombre} (${jugadorActual.color})</strong></p>`;
   
    // Actualizar rondas jugadas
    document.getElementById("info-rondas").textContent = data.rondasJugadas;

    // Buscar al jugador actual (por nombre)
    const jugador = data.jugadores.find(j => j.nombre === config.username);
    if (!jugador) return;

    // Calcular cuántas fichas NO están completadas
    const fichasRestantes = jugador.fichas.filter(f => !f.completada).length;
    document.getElementById("info-restantes").textContent = fichasRestantes;
}


function cargarEstadoDesdeServidor(data) {    
    if (data.jugadores) {
        console.log("Deserializando estado desde el servidor:", data);
        deserializaEstado(data);

        actualizarVistaInfoPartida(data);

    }
}