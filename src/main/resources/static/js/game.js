class ParchisGame{

}

class Jugador{
    constructor(nombre, color){
        this.nombre = nombre;
        this.color = color;
        this.fichas = [];
        this.turno = false;
    }

}

class Fichas{
    constructor(color, id){
        this.color = color;
        this.id = id;
        this.posicion = 0;
        this.encasa = true;
        this.enjuego = false;
    }
    // Mueve la ficha el número de espacios que indica el dado
    moverFichas(dado){
        this.posicion += dado;
    }
    // Saca la ficha de casa y la sitúa en la posición original
    sacarFichas(){
        this.encasa = false;
        this.encasa = 
        this.posicion = 0;
    }

    comerficha(){
        if (this.encasa == false){
            this.enjuego = false;
        }
    }
}