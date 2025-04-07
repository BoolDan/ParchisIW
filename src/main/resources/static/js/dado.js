export class Dado {
    constructor() {
        this.valor = 1; // Valor inicial del dado
        this.dadoElement = document.createElement('div');
        this.dadoElement.id = 'dado';
        this.dadoElement.className = 'dado';
        document.body.appendChild(this.dadoElement); 
        console.log(`Dado creado el contenedor desde dado.js`);

        this.crearCaras(); // Crear las caras del dado
        this.actualizarAnimacion(); // Mostrar la cara inicial rotando el cubo
    }

    crearCaras() {
        const posiciones = {
            1: [[1, 1]],
            2: [[0, 0], [2, 2]],
            3: [[0, 0], [1, 1], [2, 2]],
            4: [[0, 0], [0, 2], [2, 0], [2, 2]],
            5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
            6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
        };
    
        const transformaciones = [
            "rotateY(0deg) translateZ(40px)",     // cara-1
            "rotateY(180deg) translateZ(40px)",   // cara-2
            "rotateY(90deg) translateZ(40px)",    // cara-3
            "rotateY(-90deg) translateZ(40px)",   // cara-4
            "rotateX(90deg) translateZ(40px)",    // cara-5
            "rotateX(-90deg) translateZ(40px)",   // cara-6
        ];
    
        for (let i = 1; i <= 6; i++) {
            const cara = document.createElement("div");
            cara.className = `cara cara-${i}`;
            cara.style.transform = transformaciones[i - 1];
    
            const puntos = posiciones[i];
            puntos.forEach(([fila, col]) => {
                const punto = document.createElement("div");
                punto.className = "punto";
                punto.style.top = `${20 + fila * 20}px`;   // fila 0,1,2 => top: 20, 40, 60
                punto.style.left = `${20 + col * 20}px`;  // col 0,1,2 => left: 20, 40, 60
                cara.appendChild(punto);
            });
    
            this.dadoElement.appendChild(cara);
        }
    }

    lanzar() {
        this.valor = Math.floor(Math.random() * 6) + 1;
        this.actualizarAnimacion();

        console.log(`Dado lanzado: ${this.valor} DADO JS`);
        return this.valor; 
    }
    
    actualizarAnimacion() {
        const rotaciones = {
            1: "rotateX(0deg) rotateY(0deg)",
            2: "rotateX(0deg) rotateY(180deg)",
            3: "rotateX(0deg) rotateY(-90deg)",
            4: "rotateX(0deg) rotateY(90deg)",
            5: "rotateX(-90deg) rotateY(0deg)",
            6: "rotateX(90deg) rotateY(0deg)",
        };
    
        const transformacion = rotaciones[this.valor] || "rotateX(0deg) rotateY(0deg)";
        this.dadoElement.style.transform = transformacion;
    }

    getElemento() {
        return this.dadoElement;
    }
}
