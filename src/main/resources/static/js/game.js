/*MANEJA LA LOGICA DEL JUEGO, TURNOS MOVIMIENTOS ESTADO ETC, TAMBIEN ES EL QUE CONTACTA CON LA CLASE DADO*/
import { Dado } from './dado.js'; // Importa la clase Dado para usar lanzardado
import { Jugador } from './jugador.js'; // Importa la clase Jugador para manejar los jugadores
import { Fichas } from './ficha.js'; // Importa la clase Fichas para manejar las fichas
import { Tablero } from './tablero.js'; // Importa la clase Tablero para manejar el tablero
class ParchisGame {
    
    constructor() {
        this.jugadores = [];
        this.turnoActual = 0;
        this.rondasJugadas = 0;
        this.tablero = new Tablero();
        this.dado = new Dado(); 
    }

    init(numerojugadores){
        colores = ["rojo", "verde", "amarillo", "azul", "naranja", "morado"]
        for (num in numerojugadores){
            new Jugador("Jugador"+num, colores[num])
        }

    }

    salir(){
        AddEvent
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

    async lanzarDado() {
        //const valor = await this.dado.lanzar(); 
        const valor = Math.floor(Math.random() * 6) + 1; // Simulación de lanzamiento de dado
        console.log(`GAME JS El jugador  lanzó un ${valor}`);
        return valor;
    }

    moverFicha(idFicha, dado) {
        const jugador = this.jugadores[this.turnoActual];
        jugador.moverFicha(idFicha, dado);
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