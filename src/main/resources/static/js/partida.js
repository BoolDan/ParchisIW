/*
 * Permite enviar estado al servidor (via POST Ajax)
 * Y actualiza el estado del juego cuando llegan nuevos estados por WS
 */

function serializaEstado() {
    return {
        rondasJugadas: rondasJugadas,
        jugadorActual: jugadorActual,
        jugadores: jugadores.map(jugador => ({
            nombre: jugador.nombre,
            color: jugador.color,
            fichas: jugador.fichas.map(ficha => ({
                id: ficha.id,
                posicion: ficha.posicion,
                encasa: ficha.encasa,
            }))
        }))
    };
}

function deserializaEstado(datos) {
    rondasJugadas = datos.rondasJugadas;
    jugadorActual = datos.jugadorActual;
    console.log("Jugadores son: ", datos.jugadores);
    jugadores =  datos.jugadores.map(jugador => ({
        nombre: jugador.nombre,
        color: jugador.color,
        fichas: jugador.fichas.map(ficha => ({
            id: ficha.id,
            posicion: ficha.posicion,
            encasa: ficha.encasa,
        }))
    }))
    console.log("Jugadores deserializados: ", jugadores);
    actualizarTablero();
}

function enviarEstado(){
    const estado = serializaEstado();
    go(`/sendState/${config.gameId}`, 'POST', estado);
}

document.addEventListener("DOMContentLoaded", () => {
    const oldReceive = ws.receive;

    ws.receive = (data) => {
        // Lógica principal: si contiene estado de partida, deserialízalo
        console.log("Recibiendo datos del servidor:", data.jugadores);
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

function actualizarListaJugadores(jugadores) {
    const listaJugadores = document.getElementById("lista-jugadores");
    listaJugadores.innerHTML = ""; // Limpiar la lista

    jugadores.forEach(jugador => {
        const li = document.createElement("li");
        li.textContent = `${jugador.nombre} (${jugador.color})`;
        listaJugadores.appendChild(li);
    });
}


function cargarEstadoDesdeServidor(data) {    
    if (data.jugadores) {
        console.log("Deserializando estado desde el servidor:", data);
        deserializaEstado(data);
        actualizarVistaInfoPartida(data);
    }
}