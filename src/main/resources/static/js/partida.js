document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

    const partidaId = document.getElementById('game-container').dataset.id;
    const jugadores = [];
    let rondasJugadas = 0;
    let piezasRestantes = 4;

    // Instancia del juego
    const juego = new ParchisGame();

    // Función para actualizar la información de la partida
    function actualizarInformacionPartida(datos) {
        fetch(`/partida/${partidaId}/actualizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Partida actualizada:', data);
        })
        .catch(error => console.error('Error al actualizar la partida:', error));
    }

    // Agregar jugadores
    function agregarJugador(nombre, color) {
        const jugador = new Jugador(nombre, color);
        jugadores.push(jugador);
        juego.agregarJugador(nombre, color);
    }

    // Función para iniciar la partida
    function iniciarPartida() {
        //PRUEBA , CONECTAR CON BD
        agregarJugador("Jugador 1", "red");
        agregarJugador("Jugador 2", "blue");

        juego.iniciarPartida();
        actualizarEstado();
    }

    // Actualizar estado de la partida
    function actualizarEstado() {
        console.log('Actualizando estado de la partida...');
        const datos = {
            rondasJugadas: rondasJugadas,
            piezasRestantes: piezasRestantes
        };
        console.log('Datos enviados:', datos);
    
        actualizarInformacionPartida(datos);
    }

    // Llamada para iniciar la partida
    iniciarPartida();

});
