/*MANEJA LA LOGICA DEL JUEGO, TURNOS MOVIMIENTOS ESTADO ETC, TAMBIEN ES EL QUE CONTACTA CON LA CLASE DADO*/
class ParchisGame {
    constructor() {
        this.jugadores = [];
        this.turnoActual = 0;
        this.rondasJugadas = 0;
        this.piezasRestantes = 4;
        this.dado = new Dado(); 
    }

    agregarJugador(nombre, color) {
        const jugador = new Jugador(nombre, color);
        this.jugadores.push(jugador);
    }

    siguienteTurno() {
        this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
        this.rondasJugadas++;
    }

    iniciarPartida() {
        this.jugadores.forEach(jugador => {
            for (let i = 0; i < 4; i++) {
                const ficha = new Fichas(jugador.color, i);
                jugador.fichas.push(ficha);
            }
        });
    }

    lanzarDado() {
        const valor = this.dado.lanzar(); 
        console.log(`El jugador ${this.jugadores[this.turnoActual].nombre} lanzó un ${valor}`);
        return valor;
    }

    moverFicha(idFicha, dado) {
        const jugador = this.jugadores[this.turnoActual];
        jugador.moverFicha(idFicha, dado);
    }

    serializarEstado() {
        return {
            rondasJugadas: this.rondasJugadas,
            piezasRestantes: this.piezasRestantes,
            turnoActual: this.turnoActual,
            jugadores: this.jugadores.map(jugador => ({
                nombre: jugador.nombre,
                color: jugador.color,
                fichas: jugador.fichas.map(ficha => ({
                    id: ficha.id,
                    posicion: ficha.posicion,
                    encasa: ficha.encasa,
                    enjuego: ficha.enjuego
                }))
            }))
        };
    }

    deserializarEstado(datos) {
        this.rondasJugadas = datos.rondasJugadas;
        this.piezasRestantes = datos.piezasRestantes;
        this.turnoActual = datos.turnoActual;
    
        this.jugadores = datos.jugadores.map(jugadorData => {
            const jugador = new Jugador(jugadorData.nombre, jugadorData.color);
            jugador.fichas = jugadorData.fichas.map(fichaData => {
                const ficha = new Fichas(jugador.color, fichaData.id);
                ficha.posicion = fichaData.posicion;
                ficha.encasa = fichaData.encasa;
                ficha.enjuego = fichaData.enjuego;
                return ficha;
            });
            return jugador;
        });
    }
}

class Jugador {
    constructor(nombre, color) {
        this.nombre = nombre;
        this.color = color;
        this.fichas = [];
    }

    moverFicha(idFicha, dado) {
        const ficha = this.fichas[idFicha];
        ficha.moverFichas(dado);
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

    moverFichas(dado) {
        if (this.encasa) {
            this.sacarFichas();
        }
        this.posicion += dado;
        this.enjuego = true;
    }

    sacarFichas() {
        this.encasa = false;
        this.posicion = 1; // posición inicial en el tablero
    }

}