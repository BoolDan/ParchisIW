class Dado {
    constructor() {
        // Crear el elemento del dado
        this.dadoElement = document.createElement("div");
        this.dadoElement.className = "dado";
        this.dadoElement.textContent = "1"; // Valor inicial del dado

        // Valor inicial del dado
        this.valor = 1;

        // Agregar evento de clic para lanzar el dado
        this.dadoElement.addEventListener("click", () => this.lanzar());
    }

    lanzar() {
        // Generar un número aleatorio entre 1 y 6
        this.valor = Math.floor(Math.random() * 6) + 1;

        // Añadir la clase "lanzando" para activar la animación
        this.dadoElement.classList.add("lanzando");

        // Actualizar la animación del dado
        this.actualizarAnimacion();

        // Mostrar el valor en la consola
        console.log(`Dado lanzado: ${this.valor}`);

        // Remover la clase "lanzando" después de que termine la animación
        setTimeout(() => {
            this.dadoElement.classList.remove("lanzando");
        }, 1000); // Duración de la animación
    }

    actualizarAnimacion() {
        // Restablecer la animación
        this.dadoElement.style.transition = "transform 0.5s ease-in-out";
        this.dadoElement.style.transform = "rotate(0deg)"; // Resetear rotación

        // Aplicar una rotación aleatoria para simular el lanzamiento
        const xRotation = 720 + this.valor * 90; 
        const yRotation = 720 + this.valor * 90; 
        this.dadoElement.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

        // Actualizar el texto después de la animación
        setTimeout(() => {
            this.dadoElement.textContent = this.valor;
        }, 500); // Esperar a que termine la animación
    }

    getElemento() {
        return this.dadoElement;
    }
}
