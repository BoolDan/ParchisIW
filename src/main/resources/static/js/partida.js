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
        const datos = {
            rondasJugadas: rondasJugadas,
            piezasRestantes: piezasRestantes
        };

        actualizarInformacionPartida(datos);
    }

    // Llamada para iniciar la partida
    iniciarPartida();

    // Función para lanzar el dado visualmente
    function lanzarDadoVisual(callback) {
        const dadoElemento = document.getElementById('dice');
        dadoElemento.style.transition = 'transform 1s ease-in-out';

        // Generamos un número aleatorio para el dado
        const numeroDado = Math.floor(Math.random() * 6) + 1;
        console.log(`Número del dado: ${numeroDado}`);

        // Añadimos una animación para el lanzamiento del dado
        dadoElemento.style.animation = 'dadoLanzamiento 1s forwards';

        // Esperamos que termine la animación antes de llamar al callback
        setTimeout(() => {
            // Detenemos la animación y aplicamos la rotación final para el número del dado
            dadoElemento.style.animation = 'none';
            dadoElemento.style.transform = `rotateX(${numeroDado * 90}deg) rotateY(${numeroDado * 90}deg)`;
            callback(numeroDado);  // Llamamos al callback con el número del dado
        }, 1000);  // Esperamos 1 segundo por la animación
    }

    // Función para ejecutar un turno de un jugador
    function jugarTurno() {
        // Lanzamos el dado visualmente
        lanzarDadoVisual((numeroDado) => {
            console.log(`El jugador ${jugadores[juego.turnoActual].nombre} lanzó un ${numeroDado}`);

            // Mover la ficha (PROVISIONAL HAY QUE HACERLO MEJOR)
            juego.jugadores[juego.turnoActual].moverFicha(0, numeroDado);

            // Actualizamos el estado del juego
            rondasJugadas++;
            piezasRestantes--;

            // Cambiar de turno
            juego.siguienteTurno();

            // Actualizar la información de la partida en el servidor
            actualizarEstado();
        });
    }

    setTimeout(jugarTurno, 5000);  // Jugar el primer turno después de 5 seg
});
