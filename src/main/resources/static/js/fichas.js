class Fichas {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.posicion = 0;
        this.encasa = true;
        this.enjuego = false;
        this.enMeta = false;
    }

    mover(dado) {
        this.posicion += dado
    }
    
    sacar(){
        this.posicion = 0
    }

    llegarAMeta() {
        this.enMeta = true
        this.enjuego = false
    }

    reset() {
        this.posicion = 0
        this.encasa = true
        this.enjuego = false
        this.enMeta = false
    }
}