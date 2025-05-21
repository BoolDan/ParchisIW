document.addEventListener("DOMContentLoaded", () => {
    const oldReceive = ws.receive;

    ws.receive = (data) => {
        if (data.tipo === "nuevoJugador") {
            fetch(`/partida/${config.gameId}/jugadores`)
                .then(r => r.json())
                .then(data => {
                    config.jugadores = data;
                    console.log("Jugadores ACTUALIZADOS:", config.jugadores);
                    actualizarListaJugadores(config.jugadores);
                    // refrescar tablero si es necesario
                });
        }

        // Lógica principal: si contiene estado de partida, deserialízalo
        if (data.jugadores && typeof cargarEstadoDesdeServidor === 'function') {
            cargarEstadoDesdeServidor(data);
        }

        if (typeof oldReceive === 'function') oldReceive(data);
    }
});