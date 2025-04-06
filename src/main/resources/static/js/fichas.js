class Fichas {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.posicion = 0;
        this.encasa = true;
        this.enjuego = false;
        this.enMeta = false;
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
    }
}