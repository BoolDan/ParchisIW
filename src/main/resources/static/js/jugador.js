class Jugador {
    constructor(nombre, color, tipo = "Normal") {
        this.nombre = nombre;
        this.color = color;
        this.tipo = tipo; // Normal o IA
        this.fichas = [];
    }

    moverFicha(idFicha, dado, tablero) {
        const ficha = this.fichas[idFicha];
        if (ficha.encasa && dado === 5) {
            ficha.sacarFichas();
            tablero.colocarFichaEnInicio(ficha);
        } else if (!ficha.encasa) {
            tablero.moverFicha(ficha, dado);
        }
        return ficha;
    }
}