/*CLASE PARA INTERACTUAR CON EL SERVIDOR Y ACTUALIZAR LA INFO */ 
document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    const partidaId = document.getElementById('game-container').dataset.id;

    const juego = new ParchisGame();

    function actualizarEstadoEnServidor() {
        const datos = juego.serializarEstado();

        fetch(`/partida/${partidaId}/actualizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => console.log('Estado actualizado en el servidor:', data))
        .catch(error => console.error('Error al actualizar la partida:', error));
    }

    function cargarEstadoDesdeServidor() {
        fetch(`/partida/${partidaId}/estado`)
            .then(response => response.json())
            .then(data => {
                console.log('Estado cargado desde el servidor:', data);
                juego.deserializarEstado(data);
                actualizarEstado();
                actualizarTurno();
            })
            .catch(error => console.error('Error al cargar el estado:', error));
    }

    function actualizarEstado() {
        document.getElementById('rondasJugadas').textContent = juego.rondasJugadas;
        document.getElementById('piezasRestantes').textContent = juego.piezasRestantes;
        actualizarEstadoEnServidor();
    }

    function actualizarTurno() {
        const jugadorActual = juego.jugadores[juego.turnoActual];
        document.getElementById('turnoActual').textContent = jugadorActual.nombre;
        document.getElementById('colorJugador').textContent = jugadorActual.color;
    }

    function ejecutarTurno() {
        const dado = juego.lanzarDado();
        const ficha = juego.moverFicha(0, dado);

        document.getElementById('fichaMovida').textContent = `Ficha ${ficha.id}`;
        document.getElementById('posicionFicha').textContent = ficha.posicion;

        actualizarEstado();
        juego.siguienteTurno();
        actualizarTurno();
    }

    cargarEstadoDesdeServidor();

    document.getElementById('lanzar-dado').addEventListener('click', ejecutarTurno);
});