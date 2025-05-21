document.addEventListener("DOMContentLoaded", () => {
    const oldReceive = ws.receive;

    ws.receive = (data) => {
        if (data.tipo === "nuevoJugador") {
            console.log("Lista de jugadores actualizada:", data.jugadores);
            
            actualizarListaJugadores(data.jugadores);
        }

        if (typeof oldReceive === 'function') oldReceive(data);
    }
});

function actualizarListaJugadores(jugadores) {
    const listaJugadores = document.getElementById("lista-jugadores");
    listaJugadores.innerHTML = ""; // Limpiar la lista actual

    jugadores.forEach(nombre => {
        const li = document.createElement("li");
        li.textContent = nombre;
        listaJugadores.appendChild(li);
    });
}