const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

document.addEventListener("DOMContentLoaded", () => {
    const oldReceive = ws.receive;

    ws.receive = (data) => {
        if (data.tipo === "nuevoJugador") {
            console.log("Lista de jugadores actualizada:", data.jugadores);   
            actualizarListaJugadores(data.jugadores);
        }

        if (data.tipo === "actualizarListos") {
            console.log("Lista de jugadores actualizada:", data.jugadores);
            actualizarListaJugadores(data.jugadores);
        }

        if(data.tipo === "partidaIniciada") {
            console.log("Partida iniciada");
            window.location.href = `/partida/${document.getElementById("gameId").value}`;
        }

        if (typeof oldReceive === 'function') oldReceive(data);
    }
});

function actualizarListaJugadores(jugadores) {
    const listaJugadores = document.getElementById("lista-jugadores");
    const jugadorActual = document.getElementById("jugador-actual").value;
    const maxjugadores = document.getElementById("maximoPartida");
    listaJugadores.innerHTML = "";

    if (jugadores.length >= maxjugadores.value) {
        jugadores.forEach(jugador => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${jugador.nombre}</span>
                <button class="btn btn-sm ${jugador.listo ? 'btn-outline-success' : 'btn-outline-primary'} ms-2"
                        onclick="toggleListo(this)" data-jugador="${jugador.nombre}"
                        ${jugador.nombre !== jugadorActual ? "disabled" : ""}>
                    ${jugador.listo ? "Listo" : "No listo"}
                </button>
            `;
            listaJugadores.appendChild(li);
        });
    }else{
        jugadores.forEach(jugador => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${jugador.nombre}</span>
                <button class="btn btn-sm btn-outline-primary" data-jugador="${jugador.nombre}" disabled>Esperando...</button>
            `;
            listaJugadores.appendChild(li);
        });
    }
}

function toggleListo(button) {
    const jugador = button.getAttribute("data-jugador");
    const estadoActual = button.textContent.trim() === "Listo";

    // Cambiar el estado del botón localmente
    button.textContent = estadoActual ? "No listo" : "Listo";
    button.classList.toggle("btn-outline-primary", estadoActual);
    button.classList.toggle("btn-outline-success", !estadoActual);

    // Enviar el cambio de estado al servidor
    fetch(`/lobby/${config.gameId}/toggleListo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [csrfHeader]: csrfToken
        },
        body: JSON.stringify({ jugador, listo: !estadoActual })
    })
    .then(() => {
        // Intentar comenzar la partida tras cada cambio de estado
        fetch(`/lobby/${config.gameId}/comenzarPartida`, {
            method: "POST",
            headers: {
                [csrfHeader]: csrfToken
            }
        });
    })
    .catch(err => console.error("Error al cambiar el estado de listo:", err));
}