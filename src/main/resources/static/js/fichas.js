export class Fichas {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.encasa = true; // La ficha comienza en casa
        this.enPasillo = false; // La ficha no está en la meta al inicio
        this.enjuego = false;
        this.posicion = -1; // Posición inicial fuera del tablero
    }

    sacarFicha() {
        this.encasa = false;
        this.enjuego = true;
        this.enPasillo = false;
        }

    mover(dado, tablero) {
        if (this.encasa && dado === 5) {
            this.encasa = false;
            this.enjuego = true;
            this.posicion = tablero.obtenerInicio(this.color);
            tablero.colocarFichaEnInicio(this);
        } else if (this.enjuego) {
            tablero.moverFicha(this, dado);
        }
    }

    llegarAMeta() {
        this.enMeta = true;
        this.enjuego = false;
    }

    reset() {
        this.posicion = 0;
        this.encasa = true;
        this.enjuego = false;
        this.enMeta = false;
        this.enPasillo = false;
    }
}