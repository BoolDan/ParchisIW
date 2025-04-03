class ParchisGame {
    constructor() {
        this.jugadores = [];
        this.turnoActual = 0;
        this.rondasJugadas = 0;
        this.fichasComidas = 0;
        this.piezasRestantes = 0;
    }

    // Agregar jugadores al juego
    agregarJugador(nombre, color) {
        const jugador = new Jugador(nombre, color);
        this.jugadores.push(jugador);
    }

    // Cambiar turno
    siguienteTurno() {
        this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
        this.rondasJugadas++;
        this.actualizarEstado();
    }

    // Actualizar el estado de la partida en el servidor
    actualizarEstado() {
        const datos = {
            rondasJugadas: this.rondasJugadas,
            piezasRestantes: this.piezasRestantes
        };

        actualizarInformacionPartida(datos);
    }

    // Función para lanzar el dado
    lanzarDado() {
        return Math.floor(Math.random() * 6) + 1;
    }

    // Iniciar la partida
    iniciarPartida() {
        this.jugadores.forEach(jugador => {
            // Asignar las piezas de cada jugador
            for (let i = 0; i < 4; i++) {
                const ficha = new Fichas(jugador.color, i);
                jugador.fichas.push(ficha);
            }
        });
        this.actualizarEstado();
    }
}

class Jugador {
    constructor(nombre, color) {
        this.nombre = nombre;
        this.color = color;
        this.fichas = [];
        this.turno = false;
    }

    // Mover una ficha
    moverFicha(idFicha, dado) {
        const ficha = this.fichas[idFicha];
        ficha.moverFichas(dado);
    }

    // Sacar una ficha de casa
    sacarFicha(idFicha) {
        const ficha = this.fichas[idFicha];
        ficha.sacarFichas();
    }

    // Comer una ficha de otro jugador
    comerFicha(idFicha) {
        const ficha = this.fichas[idFicha];
        ficha.comerficha();
    }
}

class Fichas {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.posicion = 0;
        this.encasa = true;
        this.enjuego = false;
    }

    // Mueve la ficha el número de espacios que indica el dado
    moverFichas(dado) {
        if (this.encasa) {
            this.sacarFichas();
        }
        this.posicion += dado;
        this.enjuego = true;
    }

    // Saca la ficha de casa y la sitúa en la posición inicial
    sacarFichas() {
        this.encasa = false;
        this.posicion = 1; // posición inicial en el tablero
    }

    // Si la ficha ha sido comida, marca que ya no está en juego
    comerficha() {
        if (!this.encasa) {
            this.enjuego = false;
            this.posicion = -1; // -1 podría indicar que la ficha está fuera de juego
        }
    }
}

// Crear el juego
const juego = new ParchisGame();

// Ejemplo de agregar jugadores
juego.agregarJugador("Jugador 1", "red");
juego.agregarJugador("Jugador 2", "blue");

// Iniciar la partida
juego.iniciarPartida();

// Ejecutar un turno
const dado = juego.lanzarDado();
console.log(`El jugador ${juego.jugadores[juego.turnoActual].nombre} lanzó un ${dado}`);
juego.jugadores[juego.turnoActual].moverFicha(0, dado);
console.log(`La ficha de ${juego.jugadores[juego.turnoActual].nombre} se movió a la posición ${juego.jugadores[juego.turnoActual].fichas[0].posicion}`);

// Cambiar de turno
juego.siguienteTurno();
