import { Dado } from './dado.js';

document.addEventListener('DOMContentLoaded', function() {
    const tablero = generarEstructuraTablero(); // Genera el tablero al cargar la página
    const dado = new Dado(); // Crea una instancia del dado
    const jugadores = generarJugadores(); // Genera los jugadores al cargar la página

    renderizarTablero(tablero, jugadores, dado); // Renderiza el tablero en la página
});

function generarEstructuraTablero() {
    const estructura = [
        // Fila 1
        [
            { type: 'casa', color: 'amarillo', colspan: 7, rowspan: 7, tokens: [
                { color: 'yellow', number: 1, x: 15, y: 15 },
                { color: 'yellow', number: 2, x: 150, y: 15 },
                { color: 'yellow', number: 3, x: 15, y: 150 },
                { color: 'yellow', number: 4, x: 150, y: 150 }
            ]},
            { type: 'casilla', number: 1, colspan: 2 },
            { type: 'casilla', number: 68, colspan: 2 },
            { type: 'casilla', number: 67, colspan: 2 },
            { type: 'casa', color: 'verde', colspan: 7, rowspan: 7, tokens: [
                { color: 'green', number: 1, x: 15, y: 15 },
                { color: 'green', number: 2, x: 150, y: 15 },
                { color: 'green', number: 3, x: 15, y: 150 },
                { color: 'green', number: 4, x: 150, y: 150 }
            ]}
        ],
        // Fila 2
        [
            null,
            { type: 'casilla', number: 2, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', number: 1, colspan: 2 },
            { type: 'casilla', number: 66, colspan: 2 },
            null
        ],
        // Fila 3
        [
            null,
            { type: 'casilla', number: 3, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', number: 2, colspan: 2 },
            { type: 'casilla', number: 65, colspan: 2 },
            null
        ],
        // Fila 4
        [
            null,
            { type: 'casilla', number: 4, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', number: 3, colspan: 2 },
            { type: 'casilla', number: 64, colspan: 2 },
            null
        ],
        // Fila 5
        [
            null,
            { type: 'casilla', number: 5, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', number: 4, colspan: 2 },
            { type: 'casilla', number: 63, colspan: 2 },
            null
        ],
        // Fila 6
        [
            null,
            { type: 'casilla', number: 6, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', number: 5, colspan: 2 },
            { type: 'casilla', number: 62, colspan: 2 },
            null
        ],
        // Fila 7
        [
            null,
            { type: 'casilla', number: 7, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', number: 6, colspan: 2 },
            { type: 'casilla', number: 61, colspan: 2 },
            null
        ],
        // Fila 8
        [
            { type: 'casilla', number: 16, rowspan: 2 },
            { type: 'casilla', number: 15, rowspan: 2 },
            { type: 'casilla', number: 14, rowspan: 2 },
            { type: 'casilla', number: 13, rowspan: 2 },
            { type: 'casilla', number: 12, rowspan: 2 },
            { type: 'casilla', number: 11, rowspan: 2 },
            { type: 'casilla', number: 10, rowspan: 2 },
            { type: 'vacio' },
            { type: 'casilla', number: 8 },
            { type: 'pasillo', color: 'amarillo', number: 7},
            { type: 'vacio'},
            { type: 'casilla', number: 60 },
            { type: 'vacio' },
            { type: 'casilla', number: 58, rowspan: 2 },
            { type: 'casilla', number: 57, rowspan: 2 },
            { type: 'casilla', number: 56, rowspan: 2 },
            { type: 'casilla', number: 55, rowspan: 2 },
            { type: 'casilla', number: 54, rowspan: 2 },
            { type: 'casilla', number: 53, rowspan: 2 },
            { type: 'casilla', number: 52, rowspan: 2 }
        ],
        // Fila 9
        [
            null, null, null, null, null, null, null,
            { type: 'casilla', number: 9 },
            { type: 'centro', colspan: 4, rowspan: 4 },
            { type: 'casilla', number: 59 },
            null, null, null, null, null, null, null, null
        ],
        // Fila 10
        [
            { type: 'casilla', number: 17, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 1, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 2, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 3, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 4, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 5, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 6, rowspan: 2 },
            { type: 'vacio' },
            { type: 'vacio' },
            null, null, null,
            { type: 'pasillo', color: 'verde', number: 6, rowspan: 2 },
            { type: 'pasillo', color: 'verde', number: 5, rowspan: 2 },
            { type: 'pasillo', color: 'verde', number: 4, rowspan: 2 },
            { type: 'pasillo', color: 'verde', number: 3, rowspan: 2 },
            { type: 'pasillo', color: 'verde', number: 2, rowspan: 2 },
            { type: 'pasillo', color: 'verde', number: 1, rowspan: 2 },
            { type: 'casilla', number: 51, rowspan: 2 }
        ],
        // Fila 11
        [
            null, null, null, null, null, null, null,
            { type: 'pasillo', color: 'azul', number: 7 },
            { type: 'pasillo', color: 'verde', number: 7 },
            null, null, null, null, null, null, null, null
        ],
        // Fila 12
        [
            { type: 'casilla', number: 18, rowspan: 2 },
            { type: 'casilla', number: 19, rowspan: 2 },
            { type: 'casilla', number: 20, rowspan: 2 },
            { type: 'casilla', number: 21, rowspan: 2 },
            { type: 'casilla', number: 22, rowspan: 2 },
            { type: 'casilla', number: 23, rowspan: 2 },
            { type: 'casilla', number: 24, rowspan: 2 },
            { type: 'casilla', number: 25 },
            { type: 'casilla', number: 43 },
            { type: 'casilla', number: 44, rowspan: 2 },
            { type: 'casilla', number: 45, rowspan: 2 },
            { type: 'casilla', number: 46, rowspan: 2 },
            { type: 'casilla', number: 47, rowspan: 2 },
            { type: 'casilla', number: 48, rowspan: 2 },
            { type: 'casilla', number: 49, rowspan: 2 },
            { type: 'casilla', number: 50, rowspan: 2 }
        ],
        // Fila 13
        [
            null, null, null, null, null, null, null,
            { type: 'vacio' },
            { type: 'casilla', number: 26 },
            { type: 'vacio'},
            { type: 'pasillo', color: 'rojo', number: 7 },
            { type: 'casilla', number: 42 },
            { type: 'vacio' },
            null, null, null, null, null, null, null
        ],
        // Fila 14-20 (Azul y Rojo)
        // Fila 14
        [
            { type: 'casa', color: 'azul', colspan: 7, rowspan: 7, tokens: [
                { color: 'blue', number: 1, x: 15, y: 15 },
                { color: 'blue', number: 2, x: 150, y: 15 },
                { color: 'blue', number: 3, x: 15, y: 150 },
                { color: 'blue', number: 4, x: 150, y: 150 }
            ]},
            { type: 'casilla', number: 27, colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 6, colspan: 2 },
            { type: 'casilla', number: 41, colspan: 2 },
            { type: 'casa', color: 'rojo', colspan: 7, rowspan: 7, tokens: [
                { color: 'red', number: 1, x: 15, y: 15 },
                { color: 'red', number: 2, x: 150, y: 15 },
                { color: 'red', number: 3, x: 15, y: 150 },
                { color: 'red', number: 4, x: 150, y: 150 }
            ]}
        ],
        // Fila 15
        [
            null,
            { type: 'casilla', number: 28, colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 5, colspan: 2 },
            { type: 'casilla', number: 40, colspan: 2 },
            null
        ],
        // Fila 16
        [
            null,
            { type: 'casilla', number: 29, colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 4, colspan: 2 },
            { type: 'casilla', number: 39, colspan: 2 },
            null
        ],
        // Fila 17
        [
            null,
            { type: 'casilla', number: 30, colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 3, colspan: 2 },
            { type: 'casilla', number: 38, colspan: 2 },
            null
        ],
        // Fila 18
        [
            null,
            { type: 'casilla', number: 31, colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 2, colspan: 2 },
            { type: 'casilla', number: 37, colspan: 2 },
            null
        ],
        // Fila 19
        [
            null,
            { type: 'casilla', number: 32, colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 1, colspan: 2 },
            { type: 'casilla', number: 36, colspan: 2 },
            null
        ],
        // Fila 20
        [
            null,
            { type: 'casilla', number: 33, colspan: 2 },
            { type: 'casilla', number: 34, colspan: 2 },
            { type: 'casilla', number: 35, colspan: 2 },
            null
        ]
    ];

    return estructura;
}

function generarFichasJugador(color) {
    let fichas = [];

    for (let i = 0; i < 4; i++) {
        const ficha = {
            color: color,
            id: i + 1, // ID de la ficha (1 a 4)
            encasa: true, // La ficha comienza en casa
            enPasillo: false, // La ficha no está en la meta al inicio
            completada: false, // La ficha no está completada al inicio
            posicion: -1 // Posición inicial fuera del tablero
        }
        fichas.push(ficha);
    }

    return fichas;
}

function generarJugadores() {
    let jugadores = [];
    const colores = ['rojo', 'verde', 'azul', 'amarillo', 'morado', 'cian'];
    const nombres = ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4', 'Jugador 5', 'Jugador 6'];

    // Por el momento se generan 4 jugadores
    for (let i = 0; i < 4; i++) {
        const color = colores[i];
        const nombre = nombres[i];
        const fichas = generarFichasJugador(color); // Genera las fichas para el jugador

        jugadores.push({ nombre, color, fichas });
    }
    
    console.log("Jugadores inicializados:", jugadores);

    return jugadores;
}

function renderizarTablero(tablero, jugadores, dado) {

    const tableroContainer = document.getElementById('tablero');

    if (!tableroContainer) {
        console.error("No se encontró el contenedor del tablero.");
        return;
    }

    const table = document.createElement('table');
    table.setAttribute('border', '1px');

    tablero.forEach((fila) => {
        const tr = document.createElement('tr');
        
        fila.forEach((celda) => {
            if (celda == null) return;
            
            const td = document.createElement('td');

            if (celda.colspan) td.colSpan = celda.colspan;
            if (celda.rowspan) td.rowSpan = celda.rowspan;

            switch (celda.type) {
                case 'casa':
                    td.className = `casa ${celda.color}`;
                    celda.tokens.forEach(token => {
                        console.log(`Generando token: ${celda.color}-${token.number}`);
                        const ficha = document.createElement('div');
                        ficha.className = `token ${token.color}`;
                        ficha.textContent = token.number;
                        ficha.dataset.id = `${celda.color}-${token.number}`;

                        ficha.style.position = 'absolute';
                        ficha.style.left = `${token.x}px`;
                        ficha.style.top = `${token.y}px`;

                        td.appendChild(ficha);
                    });
                    break;
                case 'casilla':
                    td.className = 'casilla';
                    td.setAttribute('data-position', celda.number);

                    // Si está en una casilla de inicio, agregar la clase correspondiente
                    if ([5, 39, 22, 56].includes(celda.number)) {
                        const colorInicio = {
                            5: 'amarillo',
                            39: 'rojo',
                            22: 'azul',
                            56: 'verde'
                        };
                        td.classList.add(colorInicio[celda.number]);
                    }

                    const numSpan = document.createElement('span');
                    numSpan.className = 'numero-casilla';
                    numSpan.textContent = celda.number;
                    td.appendChild(numSpan);

                    break;
                case 'pasillo':
                    td.className = `pasillo ${celda.color}`;
                    td.setAttribute('data-pasillo', `${celda.color}-${celda.number || 0}`);
                    
                    if (celda.number) {
                        const numSpan = document.createElement('span');
                        numSpan.className = 'numero-casilla';
                        numSpan.textContent = celda.number;
                        td.appendChild(numSpan);
                    } else {
                        td.innerHTML = '-';
                    }

                    break;
                case 'centro':
                    td.className = 'centro';
                    const dadoElement = dado.getElemento(); // Obtener el elemento del dado

                    td.appendChild(dadoElement); // Agregar el dado al centro del tablero
                    break;
                case 'vacio':
                    td.className = 'vacio';
                    break;
                default:
                    console.error(`Tipo de celda desconocido: ${celda.type}`);
            }

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    tableroContainer.appendChild(table);
}

function iniciarTurno(jugador) {
    console.log(`Es el turno de ${jugador.nombre}`);
    // Aquí puedes agregar la lógica para iniciar el turno del jugador
}

function lanzarDado() {
    dado.lanzar().then(valor => {
        console.log("Dado lanzado con valor:", valor);
        // Aquí puedes agregar la lógica para mover las fichas del jugador actual
    });
}

function manejarResultadoDado(dado, jugador) {

}

function moverFicha(ficha, dado) {
    // Aquí puedes agregar la lógica para mover la ficha en el tablero
    console.log(`Moviendo ficha ${ficha.id} con dado ${dado}`);
    // Actualiza la posición de la ficha en el tablero y en el objeto jugador
    // ficha.posicion += dado; // Ejemplo de movimiento
}

function finalizarTurno(jugador) {
    console.log(`Turno de ${jugador.nombre} finalizado`);
    // Aquí puedes agregar la lógica para finalizar el turno del jugador
}