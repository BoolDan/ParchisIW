/*MANEJA LA LOGICA DEL JUEGO, TURNOS MOVIMIENTOS ESTADO ETC, TAMBIEN ES EL QUE CONTACTA CON LA CLASE DADO*/
import { Dado } from './dado.js'; // Importa la clase Dado para usar lanzardado
import { Jugador } from './jugador.js'; // Importa la clase Jugador para crear jugadores
import { Fichas } from './fichas.js'; // Importa la clase Fichas para crear fichas

export class ParchisGame {
    
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
        console.log(`Jugador agregado: ${nombre} (${color})`);
    }

    siguienteTurno() {
        this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
        this.rondasJugadas++;
    }

    iniciarPartida() {
        console.log("Inicializando fichas para los jugadores...");
        this.jugadores.forEach(jugador => {
            for (let i = 0; i < 4; i++) {
                const ficha = new Fichas(jugador.color, i);
                ficha.encasa = true; // Todas las fichas comienzan en casa
                ficha.enjuego = false;
                ficha.posicion = -1; // Posición inicial fuera del tablero
                jugador.fichas.push(ficha);
            }
        });
        console.log("Fichas inicializadas para todos los jugadores:", this.jugadores);
    }

    async lanzarDado() {
        const valor = await this.dado.lanzar(); // Espera a que el dado termine de girar
        console.log(`GAME JS El jugador lanzó un ${valor}`);
        return valor;
    }

    moverFicha(idFicha, dado) {
        const jugador = this.jugadores[this.turnoActual];
        jugador.moverFicha(idFicha, dado);
    }

    jugarTurno(valorDado, tablero) {
        const jugador = this.jugadores[this.turnoActual];
        console.log(`Turno de ${jugador.nombre} (${jugador.color}) con el dado ${valorDado}`);
        console.log("Estado de las fichas del jugador:", jugador.fichas);

        let fichaMovida = false;

        if (valorDado === 5) {
            for (const ficha of jugador.fichas) {
                console.log(`Verificando ficha: ${ficha.id}, encasa: ${ficha.encasa}`);
                if (ficha.encasa) {
                    if (tablero.colocarFichaEnInicio(ficha)) {
                        ficha.sacarFicha();
                        fichaMovida = true;
                        console.log(`El jugador ${jugador.nombre} sacó una ficha.`);
                        break;
                    } else {
                        console.log(`No se pudo colocar la ficha ${ficha.id} en el inicio.`);
                    }
                }
            }
        }

        // Si no se sacó ficha, intentar mover una ficha en el tablero
        if (!fichaMovida) {
            for (const ficha of jugador.fichas) {
                if (ficha.enjuego) {
                    if (tablero.moverFicha(ficha, valorDado)) {
                        fichaMovida = true;
                        console.log(`El jugador ${jugador.nombre} movió una ficha.`);
                        break;
                    }
                }
            }
        }

        // Si no se pudo mover ninguna ficha, pasar el turno
        if (!fichaMovida) {
            console.log(`El jugador ${jugador.nombre} no pudo mover ninguna ficha.`);
        }

        // Avanzar al siguiente turno
        this.siguienteTurno();
    }

    serializarEstado() {
        return {
            rondasJugadas: this.rondasJugadas,
            turnoActual: this.turnoActual,
            jugadores: this.jugadores.map(jugador => ({
                nombre: jugador.nombre,
                color: jugador.color,
                fichas: jugador.fichas.map(ficha => ({
                    id: ficha.id,
                    posicion: ficha.posicion,
                    encasa: ficha.encasa,
                    enjuego: ficha.enjuego,
                    enMeta: ficha.enMeta
                }))
            }))
        };
    }
    deserializarEstado(datos) {
        this.rondasJugadas = datos.rondasJugadas;
        this.turnoActual = datos.turnoActual;
    
        this.jugadores = datos.jugadores.map(jugadorData => {
            const jugador = new Jugador(jugadorData.nombre, jugadorData.color);
            jugador.fichas = jugadorData.fichas.map(fichaData => {
                const ficha = new Fichas(jugador.color, fichaData.id);
                ficha.posicion = fichaData.posicion;
                ficha.encasa = fichaData.encasa;
                ficha.enjuego = fichaData.enjuego;
                ficha.enMeta = fichaData.enMeta;
                return ficha;
            });
            return jugador;
        });
    }

    getDadoElemento() {
        return this.dado.getElemento(); // Devuelve el elemento del dado
    }
    
}
window.game = new ParchisGame(); // Aquí estamos creando la instancia

console.log("✅ game.js cargado correctamente DESDE GAME.JS");

window.onload = () => {
    console.log("Esperando a que todo cargue...");
    console.log("¿Game está definido?", window.game);
};