class Dado {
    constructor() {
        this.valor = 1; // Valor inicial del dado
        this.crearCaras();
    }

    crearCaras() {
        for (let i = 1; i <= 6; i++) {
            const cara = document.createElement("div");
            cara.className = `cara cara-${i}`;
            cara.dataset.valor = i;
    
            // Crear los puntos para cada cara
            for (let j = 0; j < i; j++) {
                const punto = document.createElement("div");
                punto.className = "punto";
                cara.appendChild(punto);
            }
    
            this.dadoElement.appendChild(cara);
        }
    }

    lanzar() {
        this.valor = Math.floor(Math.random() * 6) + 1;
        this.actualizarAnimacion();
        this.mostrarPuntos(this.valor);

        console.log(`Dado lanzado: ${this.valor}`);
    }

    actualizarAnimacion() {
        // Restablecer la animación
        this.dadoElement.style.transition = "transform 0.5s ease-in-out";
        this.dadoElement.style.transform = "rotate(0deg)";

        // Aplicar una rotación aleatoria para simular el lanzamiento
        const xRotation = 720 + this.valor * 90; // Rotación en el eje X
        const yRotation = 720 + this.valor * 90; // Rotación en el eje Y
        this.dadoElement.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }

    mostrarPuntos(valor) {
        console.log(`Intentando mostrar la cara-${valor}`); // Depuración inicial
    
        // Ocultar todas las caras
        const caras = this.dadoElement.querySelectorAll(".cara");
        caras.forEach(cara => {
            cara.classList.remove("cara-activa");
            console.log(`Cara ${cara.dataset.valor} desactivada.`); // Depuración para cada cara desactivada
        });
    
        // Mostrar la cara correspondiente al valor
        const caraVisible = this.dadoElement.querySelector(`.cara-${valor}`);
        if (caraVisible) {
            caraVisible.classList.add("cara-activa");
            console.log(`Cara ${valor} activada.`); // Depuración para la cara activada
            console.log("Contenido de la cara:", caraVisible.innerHTML); // Verificar los puntos
        } else {
            console.error(`No se encontró la cara-${valor} en el DOM.`); // Error si no se encuentra la cara
        }
    }
    
    getElemento() {
        return this.dadoElement;
    }
}