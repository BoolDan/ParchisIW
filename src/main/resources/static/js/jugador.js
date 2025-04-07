import { Fichas } from './ficha.js';

class Jugador {


    constructor(nombre, color, tipo = "Normal", fichas = []) {
        this.nombre = nombre;
        this.color = color;
        this.tipo = tipo; // Normal o IA
        this.fichas = [];
    }

    esperarClickFicha() {
        return new Promise((resolve) => {
            const fichasElementos = document.querySelectorAll(`.ficha[data-jugador="${this.color}"]`);
            const manejador = (event) => {
                fichasElementos.forEach(ficha => ficha.removeEventListener('click', manejador));
                const fichaId = event.target.dataset.id; // Suponiendo que cada ficha tiene un atributo `data-id`
                const fichaSeleccionada = this.fichas.find(ficha => ficha.id === fichaId);
                resolve(fichaSeleccionada);
            };
    
            fichasElementos.forEach(ficha => ficha.addEventListener('click', manejador));
        });
    }

    async moverFicha(dado) {
        //Buscamos primero si hay alguna ficha que se encuentre en la reserva d fichas del jugador (casa)
        const encasa = this.fichas.find(ficha => ficha.encasa);
        if (dado == 5 && encasa){
            for (ficha in this.fichas){
                if (ficha.encasa == true){
                    ficha.sacar()
                }
            }
        }
        else{
           window.print("Selecciona una ficha que no esté en casa para mover")
           const fichaSeleccionada = await this.esperarClickFicha();
            if (fichaSeleccionada) {
                fichaSeleccionada.mover(dado); // Mueve la ficha seleccionada según el dado
            } else {
                console.error("No se seleccionó ninguna ficha");
            }
        }
    }
}