/*CLASE PARA INTERACTUAR CON EL SERVIDOR Y ACTUALIZAR LA INFO */ 
document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
    const partidaId = document.getElementById('game-container').dataset.id;

    const juego = new ParchisGame(); //creo la partida 

    function actualizarEstadoEnServidor() {
        const datos = juego.serializarEstado(); //conecto el servidor para actualizarlo

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
                actualizarEstado();//actualiza la interfaz 
                actualizarTurno();//el turno actual en la interfaz
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
        if (!fichaSeleccionada) {
            alert("Por favor, selecciona una ficha antes de lanzar el dado.");
            return;
        }
    
        const dado = juego.lanzarDado();
        const jugador = juego.jugadores[juego.turnoActual];
        const ficha = jugador.fichas[fichaSeleccionada.id];
    
        ficha.mover(dado, juego.tablero);
    
        // Actualizar la interfaz
        document.getElementById('fichaMovida').textContent = `Ficha ${ficha.id}`;
        document.getElementById('posicionFicha').textContent = ficha.posicion;
    
        // Sincronizar servidor
        actualizarEstadoEnServidor();
    
        if (juego.verificarVictoria()) {
            alert(`¡El jugador ${jugador.nombre} ha ganado!`);
        } else {
            juego.siguienteTurno();
            actualizarTurno();
        }
    }

let fichaSeleccionada = null; //let es para variables que pueden cambiar de valor 

function seleccionarFicha(elemento) {
    // Quitar la clase 'ficha-seleccionada' de todas las fichas
    document.querySelectorAll('.ficha').forEach(ficha => ficha.classList.remove('ficha-seleccionada'));

    // Agregar la clase 'ficha-seleccionada' a la ficha clicada
    elemento.classList.add('ficha-seleccionada');

    // Guardar el ID de la ficha seleccionada
    fichaSeleccionada = {
        id: parseInt(elemento.dataset.id, 10),
        color: elemento.dataset.color
    };

    console.log(`Ficha seleccionada: ID=${fichaSeleccionada.id}, Color=${fichaSeleccionada.color}`);
}
    cargarEstadoDesdeServidor();

    document.getElementById('lanzar-dado').addEventListener('click', ejecutarTurno);
});