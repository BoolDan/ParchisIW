class Dado {
    constructor() {
        this.valor = 1; // Valor inicial del dado
        this.animando = false; // Bandera para controlar si el dado está en animación
        this.dadoElement = document.createElement('div');
        this.dadoElement.id = 'dado';
        this.dadoElement.className = 'dado';
      //  document.body.appendChild(this.dadoElement);
        console.log(`Dado creado el contenedor desde dado.js`);

        this.crearCaras(); // Crear las caras del dado
        this.actualizarAnimacion(); // Mostrar la cara inicial rotando el cubo
    }

    setValor(valor){
        this.valor = valor;
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

    async lanzar() {
        // Marcar el dado como animando y deshabilitar clics
        this.animando = true;
        this.dadoElement.style.pointerEvents = 'none';

        //const nuevoValor = Math.floor(Math.random() * 6) + 1;

        // Siempre animar, aunque salga el mismo número
        let extra = Math.floor(Math.random() * 360) + 180; // entre 180 y 540 grados
        this.dadoElement.style.transition = "transform 1s cubic-bezier(.36,2,.57,.5)";
        this.dadoElement.style.transform += ` rotateZ(${extra}deg)`;

        await this.esperar(50); // Esperar un poco para que se vea la animación

        //this.valor = nuevoValor;
        this.actualizarAnimacion();

        const promesa = new Promise((resolve) => {
            const handler = () => {
                this.dadoElement.removeEventListener('transitionend', handler);
                this.animando = false;
                this.dadoElement.style.pointerEvents = 'auto';
                this.dadoElement.style.transition = "";
                resolve(this.valor);
            };
            this.dadoElement.addEventListener('transitionend', handler);
        });

        return await promesa;
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
        if (this.animando) {
            this.dadoElement.style.transition = "transform 0.15s";
        } else {
            this.dadoElement.style.transition = "";
        }
        this.dadoElement.style.transform = transformacion;
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getElemento() {
        return this.dadoElement;
    }

  lanzarAnimacion(valorFinal) {
        this.animando = true;
        this.dadoElement.style.pointerEvents = 'none';

        let giros = 7;
        const animar = () => {
            if (giros > 0) {
                const random = Math.floor(Math.random() * 6) + 1;
                this.valor = random;
                this.actualizarAnimacion();
                giros--;
                setTimeout(animar, 80); // un poco más lento para que se vea
            } else {
                // Muestra la cara real con transición
                setTimeout(() => {
                    this.valor = valorFinal;
                    this.actualizarAnimacion();
                    this.animando = false;
                    this.dadoElement.style.pointerEvents = 'auto';
                }, 120);
            }
        };
        animar();
    }
}
