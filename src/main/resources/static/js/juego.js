import { Dado } from './dado.js';

let tablero;
let dado;
let jugadores = [];
let jugadorActual = 0; // Índice del jugador actual (0 a 3 para 4 jugadores)
let rondasJugadas = 0; // Número de rondas jugadas
let turnoFinalizado = false; // Indica si el turno ha finalizado
let fichaSeleccionada; // Ficha seleccionada por el jugador

document.addEventListener('DOMContentLoaded', function() {

    tablero = generarEstructuraTablero(); // Genera el tablero al cargar la página
    dado = new Dado(); // Crea una instancia del dado
    jugadores = generarJugadores(); // Genera los jugadores al cargar la página

    renderizarTablero(tablero, jugadores, dado); // Renderiza el tablero en la página
    
    iniciarJuego(); // Inicia el juego al cargar la página
});

function obtenerInicio(color) {
    const inicios = {
        rojo: 39,
        azul: 22,
        verde: 56,
        amarillo: 5,
    };
    return inicios[color] || null; // Devuelve la posición de inicio según el color
}

function obtenerUltimaCasilla(color) {
    const ultimasCasillas = {
        rojo: 34,
        azul: 17,
        verde: 51,
        amarillo: 68,
    };
    return ultimasCasillas[color] || null; // Devuelve la última casilla según el color
}

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
    let listaJugadores = [];
    const colores = ['rojo', 'verde', 'azul', 'amarillo', 'morado', 'cian'];
    const nombres = ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4', 'Jugador 5', 'Jugador 6'];

    // Por el momento se generan 4 jugadores
    for (let i = 0; i < 4; i++) {
        const color = colores[i];
        const nombre = nombres[i];
        const fichas = generarFichasJugador(color); // Genera las fichas para el jugador

        listaJugadores.push({ nombre, color, fichas });
    }
    
    console.log("Jugadores inicializados:", listaJugadores);

    return listaJugadores;
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

                        jugadores

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

function iniciarJuego() {
    const jugador = jugadores[jugadorActual]; // Obtener el jugador actual
    iniciarTurno(jugador); // Iniciar el turno del jugador actual
}

function siguienteTurno() {
    jugadorActual = (jugadorActual + 1) % jugadores.length; // Cambiar al siguiente jugador
    rondasJugadas++; // Incrementar el número de rondas jugadas 
}

function iniciarTurno(jugador) {
    console.log(`Es el turno de ${jugador.nombre}`);
    lanzarDado(dado); // Lanzar el dado al iniciar el turno
}

function lanzarDado(dado) {
    const dadoElement = dado.getElemento();
    dadoElement.addEventListener('click', async () => {
        if (!dado.animando) {
            const valor = await dado.lanzar();
            console.log("Dado lanzado con valor:", valor);
            habilitarFichasClicables(valor, jugadores[jugadorActual]); // Manejar el click de las fichas posibles
        }
    });
}

function obtenerFichasClicables(valorDado, jugador) {
    let fichasClicables = jugador.fichas.filter(ficha => {
        if (valorDado === 5 && ficha.encasa) {
            // Si el dado es 5, habilita las fichas en casa
            return !hayDosFichasEnSalida(jugador); // Solo si no hay dos fichas en la salida
        } else if (!ficha.encasa && ficha.posicion >= 0) {
            // Si el dado no es 5, habilita las fichas que están en el tablero
            return true;
        }
        return false;
    });

    return fichasClicables;
}

function habilitarFichasClicables(valorDado, jugador) {
    const fichasClicables = obtenerFichasClicables(valorDado, jugador); // Obtener las fichas que se pueden mover
    console.log("Fichas clicables:", fichasClicables);

    // Habilitar las fichas clicables
    fichasClicables.forEach(ficha => {
        const fichaElement = document.querySelector(`[data-id="${ficha.color}-${ficha.id}"]`);
        if (fichaElement) {
            fichaElement.classList.add('clicable'); // Agregar clase para indicar que es clicable
            fichaElement.addEventListener('click', () => {
                if (ficha.encasa) {
                    sacarFichaDeCasa(jugador, ficha);
                } else {
                    moverFicha(ficha, valorDado);
                }
                deshabilitarFichasClicables(jugador); // Deshabilitar las fichas después de hacer clic
            });
        }
    });
}

function deshabilitarFichasClicables(jugador) {
    jugador.fichas.forEach(ficha => {
        const fichaElement = document.querySelector(`[data-id="${ficha.color}-${ficha.id}"]`);
        if (fichaElement) {
            fichaElement.classList.remove('clicable'); // Quitar la clase clicable
            fichaElement.replaceWith(fichaElement.cloneNode(true)); // Eliminar los EventListeners
        }
    });
}

function hayDosFichasEnSalida(jugador) {
    return jugador.fichas.filter(ficha => ficha.posicion === obtenerInicio(jugador.color)).length >= 2;
}    

function sacarFichaDeCasa(jugador, ficha) {
    const posicionInicio = obtenerInicio(jugador.color);
    if (hayDosFichasEnSalida(jugador)) {
        console.log("No puedes sacar una ficha de casa porque ya tienes dos en salida.");
        return;
    }

    ficha.encasa = false;
    ficha.posicion = posicionInicio;
    console.log(`Ficha ${ficha.color}-${ficha.id} sacada de casa a la posición ${posicionInicio}`);
    actualizarTablero(); // Actualizar el tablero después de mover la ficha
}

function moverFicha(ficha, valorDado) {
    const nuevaPosicion = ficha.posicion + valorDado;

    // Verificar si hay una ficha en la nueva posición
    const fichaEnDestino = jugadores.flatMap(j => j.fichas).find(f => f.posicion === nuevaPosicion);

    if (fichaEnDestino) {
        console.log(`Ficha ${fichaEnDestino.color}-${fichaEnDestino.id} comida y enviada a casa.`);
        fichaEnDestino.encasa = true;
        fichaEnDestino.posicion = -1; // Enviar la ficha comida a casa
    }

    ficha.posicion = nuevaPosicion; // Actualizar la posición de la ficha
    console.log(`Ficha ${ficha.color}-${ficha.id} movida a la posición ${nuevaPosicion}`);
    actualizarTablero(); // Actualizar el tablero después de mover la ficha
}

function actualizarTablero() {
    
    const tableroContainer = document.getElementById('tablero');
    if (!tableroContainer) {
        console.error("No se encontró el contenedor del tablero.");
        return;
    }

    // Elimina todas las fichas visibles actualmente
    const fichasActuales = tableroContainer.querySelectorAll('.token');
    fichasActuales.forEach(ficha => ficha.remove());

    jugadores.forEach(jugador => {
        jugador.fichas.forEach(ficha => {
            const nuevaFicha = document.createElement('div');
            nuevaFicha.classList.add('token', ficha.color);
            nuevaFicha.textContent = ficha.id;
            nuevaFicha.dataset.id = `${ficha.color}-${ficha.id}`;

            if (ficha.encasa) {
                const casa = document.querySelector(`.casa.${ficha.color}`);
                if (casa) {
                    nuevaFicha.style.position = 'absolute';
                    
                    switch (ficha.id) {
                        case 1:
                            nuevaFicha.style.left = '15px';
                            nuevaFicha.style.top = '15px';
                            break;
                        case 2:
                            nuevaFicha.style.left = '150px';
                            nuevaFicha.style.top = '15px';
                            break;
                        case 3:
                            nuevaFicha.style.left = '15px';
                            nuevaFicha.style.top = '150px';
                            break;
                        case 4:
                            nuevaFicha.style.left = '150px';
                            nuevaFicha.style.top = '150px';
                            break;
                    }
                    casa.appendChild(nuevaFicha);
                } else {
                    console.warn(`No se encontró la casa para el color ${ficha.color}`);
                }
            } else {
                // Ficha fuera de casa: en una casilla
                const casilla = document.querySelector(`[data-position="${ficha.posicion}"]`);
                if (casilla) {
                    // Aseguramos que no se conserve estilo absoluto
                    nuevaFicha.style.position = 'relative';
                    nuevaFicha.style.left = '0';
                    nuevaFicha.style.top = '0';
                    casilla.appendChild(nuevaFicha);
                } else {
                    console.warn(`No se encontró la casilla para posición ${ficha.posicion}`);
                }
            }
        });
    });
}

function finalizarTurno(jugador) {
    console.log(`Turno de ${jugador.nombre} finalizado`);
    // Aquí puedes agregar la lógica para finalizar el turno del jugador
    turnoFinalizado = true; // Marcar el turno como finalizado
    siguienteTurno(); // Avanzar al siguiente turno
}