/*clase tablero HAY QUE CAMBIAR COMO SE MUESTRA EL TABLERO ABAJO PARA QUE FUNCIONE BIEN GUARDANDO LAS COSAS*/
import { Dado } from './dado.js'; // Importa la clase Dado para usar el contenedor que se crea en el constructor
import { ParchisGame } from './game.js'; // Importa la clase ParchisGame para usar el contenedor que se crea en el constructor

class Tablero {
    constructor(game) {
        this.game = game; // Instancia de ParchisGame
        this.casillas = Array(68).fill(null); // 68 casillas en el tablero
        this.pasillos = {
            rojo: Array(7).fill(null),
            azul: Array(7).fill(null),
            verde: Array(7).fill(null),
            amarillo: Array(7).fill(null)
        }; 
    }

    obtenerInicio(color) {
        const inicios = {
            rojo: 39,
            azul: 22,
            verde: 56,
            amarillo: 5
        };
        return inicios[color];
    }

    obtenerMeta(color) {
        const metas = {
            amarillo: 67,
            azul: 16,
            verde: 50,
            rojo: 33
        };
        return metas[color];
    }

    actualizarTablero() {
        console.log("Actualizando el tablero en el DOM...");
        
        const tableroContainer = document.getElementById('tablero');
        if (!tableroContainer) {
            console.error("El contenedor del tablero no existe en el DOM.");
            return;
        }
    
        // Mover fichas completadas al contenedor correspondiente
        const completadasContainer = document.getElementById('fichas-completadas');
        if (completadasContainer) {
            Object.keys(this.pasillos).forEach(color => {
                this.pasillos[color].forEach((ficha, index) => {
                    if (ficha && ficha.completada) {
                        let fichaElement = document.querySelector(`[data-id="${ficha.color}-${ficha.id}"]`);

                        if (!fichaElement) {
                            // Si no existe, creamos la ficha DOM
                            fichaElement = document.createElement('div');
                            fichaElement.className = `ficha ${ficha.color}`;
                            fichaElement.textContent = ficha.id;
                            fichaElement.setAttribute('data-id', `${ficha.color}-${ficha.id}`);
                            console.warn(`Ficha ${ficha.color}-${ficha.id} no estaba en el DOM, se ha creado.`);
                        }

                        completadasContainer.appendChild(fichaElement);
                        console.log(`Ficha ${ficha.color}-${ficha.id} movida al contenedor de fichas completadas.`);
                    }
                });
            });
        } else {
            console.error("No se encontró el contenedor de fichas completadas en el DOM.");
        }

        // Limpiar todas las fichas del tablero
        const fichasDOM = tableroContainer.querySelectorAll('.ficha');
        fichasDOM.forEach(ficha => ficha.remove());
    
        // Actualizar las casillas
        this.casillas.forEach((fichas, posicion) => {
            if (fichas && fichas.length > 0) {
                // Excluir fichas completadas
                const fichasNoCompletadas = fichas.filter(ficha => !ficha.completada);
    
                if (fichasNoCompletadas.length > 0) {
                    console.log(`Actualizando casilla ${posicion} con fichas:`, fichasNoCompletadas);
                    const casillaDOM = document.querySelector(`[data-posicion="${posicion}"]`);
                    if (casillaDOM) {
                        fichasNoCompletadas.forEach(ficha => {
                            let fichaElement = document.querySelector(`[data-id="${ficha.color}-${ficha.id}"]`);
                            if (fichaElement) {
                                casillaDOM.appendChild(fichaElement);
                                fichaElement.style.position = 'relative';
                                fichaElement.style.left = '0';
                                fichaElement.style.top = '0';
                            } else {
                                console.warn(`No se encontró el token para la ficha ${ficha.color}-${ficha.id}`);
                            }
                        });
                    } else {
                        console.warn(`No se encontró la casilla en el DOM para la posición ${posicion}`);
                    }
                }
            }
        });
    
        // Actualizar los pasillos
        Object.keys(this.pasillos).forEach(color => {
            this.pasillos[color].forEach((ficha, index) => {
                if (ficha && !ficha.completada) { // Excluir fichas completadas
                    const pasilloDOM = document.querySelector(`[data-pasillo="${color}-${index}"]`);
                    if (pasilloDOM) {
                        let fichaElement = document.querySelector(`[data-id="${ficha.color}-${ficha.id}"]`);
                        if (fichaElement) {
                            pasilloDOM.appendChild(fichaElement);
                        } else {
                            // Crear la ficha si no existe en el DOM
                            fichaElement = document.createElement('div');
                            fichaElement.className = `ficha ${ficha.color}`;
                            fichaElement.textContent = ficha.id;
                            fichaElement.setAttribute('data-id', `${ficha.color}-${ficha.id}`);
                            pasilloDOM.appendChild(fichaElement);
                        }
                    } else {
                        console.warn(`No se encontró el pasillo en el DOM para ${color}-${index}`);
                    }
                }
            });
        });
    

    }

    colocarFichaEnInicio(ficha) {
        console.log(`Buscando token en el DOM: ${ficha.color}-${ficha.id}`);
        const inicio = this.obtenerInicio(ficha.color); // Obtiene la posición de inicio según el color
        const fichaElement = document.querySelector(`[data-id="${ficha.color}-${ficha.id}"]`); // Busca el token en el DOM
    
        if (!fichaElement) {
            console.error(`No se encontró el token para la ficha ${ficha.color}-${ficha.id}`);
            return false;
        }
    
        if (!this.casillas[inicio]) {
            this.casillas[inicio] = [ficha];
            ficha.enjuego = true;
            ficha.encasa = false;
            ficha.posicion = inicio; // Actualiza la posición de la ficha
    
            // Log de ficha colocada en inicio
            console.log(`Ficha colocada en inicio: ${ficha.color}-${ficha.id}, posición: ${ficha.posicion}`);
    
            // Mueve el token al tablero
            const casillaDOM = document.querySelector(`[data-posicion="${inicio}"]`);
            if (casillaDOM) {
                casillaDOM.appendChild(fichaElement);
                fichaElement.style.position = 'relative'; // Ajusta la posición si es necesario
                fichaElement.style.left = '0';
                fichaElement.style.top = '0';
            }
    
            this.actualizarTablero(); // Actualizar el DOM
            return true;
        } else if (this.casillas[inicio].length < 2) {
            this.casillas[inicio].push(ficha);
            ficha.enjuego = true;
            ficha.encasa = false;
            ficha.posicion = inicio; // Actualiza la posición de la ficha
    
            // Log de ficha colocada en inicio
            console.log(`Ficha colocada en inicio: ${ficha.color}-${ficha.id}, posición: ${ficha.posicion}`);
    
            // Mueve el token al tablero
            const casillaDOM = document.querySelector(`[data-posicion="${inicio}"]`);
            if (casillaDOM) {
                casillaDOM.appendChild(fichaElement);
                fichaElement.style.position = 'relative'; // Ajusta la posición si es necesario
                fichaElement.style.left = '0';
                fichaElement.style.top = '0';
            }
    
            this.actualizarTablero(); // Actualizar el DOM
            return true;
        }
        console.log("No se puede colocar más fichas en la casilla de inicio.");
        return false;
    }

    moverFicha(ficha, dado) {
        console.log(`Intentando mover ${ficha.color}-${ficha.id}, posición: ${ficha.posicion}, dado: ${dado}`);
    
        const meta = this.obtenerMeta(ficha.color);
    
        // Si la ficha ya está en el pasillo
        if (ficha.enPasillo) {
            const nuevaPosicion = ficha.posicion + dado;

            // Calcular los pasos necesarios para llegar a la casilla final (casilla "8")
            const pasosParaFinal = 8 - ficha.posicion;

            if (dado === pasosParaFinal) {
                // Mover directamente a la casilla final
                this.pasillos[ficha.color][ficha.posicion] = null;
                ficha.posicion = -1; // Casilla final
                ficha.enPasillo = false;
                ficha.enjuego = false; // La ficha ya no está en juego
                ficha.completada = true; // Marcar como completada

                console.log(`La ficha ${ficha.color}-${ficha.id} ha llegado a la casilla final y está completada.`);
                this.actualizarTablero();
                return true;
            } else if (nuevaPosicion <= 7) {
                // Avanzar en el pasillo
                this.pasillos[ficha.color][ficha.posicion] = null;
                ficha.posicion = nuevaPosicion;
                this.pasillos[ficha.color][nuevaPosicion] = ficha;
                console.log(`Ficha ${ficha.color}-${ficha.id} movida al pasillo en posición ${nuevaPosicion}`);
                this.actualizarTablero();
                return true;
            } else {
                console.log(`El dado no es suficiente para mover la ficha ${ficha.color}-${ficha.id} a la casilla final.`);
                return false; // No se mueve más en este turno
            }
        }
    
        // Ficha aún está en el tablero principal
        const distanciaAMeta = (meta - ficha.posicion + 68) % 68;
    
        if (dado >= distanciaAMeta) {
            const pasosEnMeta = distanciaAMeta;
            const pasosEnPasillo = dado - pasosEnMeta;
    
            if (pasosEnMeta > 0) {
                if (this.casillas[ficha.posicion]) {
                    this.casillas[ficha.posicion] = this.casillas[ficha.posicion].filter(f => f !== ficha);
                }
    
                ficha.posicion = meta;
                this.casillas[meta] = this.casillas[meta] || [];
                this.casillas[meta].push(ficha);
    
                console.log(`Ficha ${ficha.color}-${ficha.id} movida a la meta en casilla ${meta}`);
                this.actualizarTablero();
    
                if (pasosEnPasillo === 0) {
                    return true;
                }
            }
    
            if (pasosEnPasillo > 0 && pasosEnPasillo <= 7) {
                if (this.casillas[meta]) {
                    this.casillas[meta] = this.casillas[meta].filter(f => f !== ficha);
                }
    
                ficha.enPasillo = true;
                ficha.posicion = pasosEnPasillo - 1; // Índice dentro del pasillo (0 a 6)
                this.pasillos[ficha.color][ficha.posicion] = ficha;
    
                console.log(`La ficha ${ficha.color}-${ficha.id} entra al pasillo en posición ${ficha.posicion}`);
                this.actualizarTablero();
                return true;
            } else {
                console.log("El dado es demasiado alto, la ficha se pasaría del final del pasillo.");
                return false;
            }
        } else {
            // Movimiento normal en el tablero circular
            const nuevaPosicion = (ficha.posicion + dado) % 68;
    
            if (this.casillas[ficha.posicion]) {
                this.casillas[ficha.posicion] = this.casillas[ficha.posicion].filter(f => f !== ficha);
            }
    
            ficha.posicion = nuevaPosicion;
            this.casillas[nuevaPosicion] = this.casillas[nuevaPosicion] || [];
            this.casillas[nuevaPosicion].push(ficha);
    
            console.log(`Ficha ${ficha.color}-${ficha.id} movida a casilla ${nuevaPosicion}`);
            this.actualizarTablero();
            return true;
        }
    }
    

    mostrarTurno() {
        const jugadorActual = this.game.jugadores[this.game.turnoActual];  
        const mensajeTurno = document.getElementById('mensaje-turno');
        if (!mensajeTurno) {
            console.error("El elemento mensaje-turno no existe en el DOM.");    
            return;
        }
        mensajeTurno.textContent = `Turno de ${jugadorActual.nombre} (${jugadorActual.color})`;
    }

    generarTablero() {
        const tableroContainer = document.getElementById('tablero');
        if (!tableroContainer) {
            console.error("El contenedor del tablero no existe en el DOM.");
            return;
        }
        
        // Crear la tabla
        const table = document.createElement('table');
        table.setAttribute('border', '1px');
    
    
         // Estructura del tablero
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

        // Generar filas
        estructura.forEach((fila) => {
            const tr = document.createElement('tr');
    
            fila.forEach((celda) => {
                if (celda === null) return;
    
                const td = document.createElement('td');
    
                if (celda.colspan) td.colSpan = celda.colspan;
                if (celda.rowspan) td.rowSpan = celda.rowspan;
    
                switch (celda.type) {
                    case 'casa':
                        td.className = `casa ${celda.color}`;
                        if (celda.tokens) {
                            celda.tokens.forEach(token => {
                                console.log(`Generando token: ${celda.color}-${token.number - 1}`);
                                const tokenElement = document.createElement('div');
                                tokenElement.className = `token ${token.color}`;
                                tokenElement.textContent = token.number;

                                // id único para cada ficha
                                tokenElement.dataset.id = `${celda.color}-${token.number - 1}`; // Ajusta el número para que coincida con el índice

                                // seleccionar la ficha
                                tokenElement.addEventListener('click', function () {
                                    fichaSeleccionada = {
                                        id: tokenElement.dataset.id,
                                        color: token.color,
                                        number: token.number
                                    };

                                    // Actualizar el dataset.id dinámicamente
                                    console.log(`Ficha seleccionada: ID=${fichaSeleccionada.id}, Color=${fichaSeleccionada.color}, Número=${fichaSeleccionada.number}`);
                                });

                                // Posicionar las fichas correctamente dentro de la casa
                                tokenElement.style.position = 'absolute';
                                tokenElement.style.left = `${token.x}px`;
                                tokenElement.style.top = `${token.y}px`;

                                td.appendChild(tokenElement);
                            });
                        }
                        break;
                    case 'casilla':
                        td.className = 'casilla';
                        td.setAttribute('data-posicion', celda.number); // Agregar atributo data-posicion
                    
                        // Si la casilla es una casilla de inicio, agrega una clase de color
                        if ([5, 39, 22, 56].includes(celda.number)) {
                            const colorInicio = {
                                5: 'amarillo',
                                39: 'rojo',
                                22: 'azul',
                                56: 'verde'
                            };
                            td.classList.add(colorInicio[celda.number]); // Agregar clase de color
                        }
                    
                        const numSpan = document.createElement('span');
                        numSpan.className = 'numero-casilla';
                        numSpan.textContent = celda.number;
                        td.appendChild(numSpan);
                        break;
                    case 'pasillo':
                        td.className = `pasillo ${celda.color}`;
                        td.setAttribute('data-pasillo', `${celda.color}-${celda.number || 0}`); // Agregar atributo data-pasillo
                        if (celda.number) {
                            const numSpan = document.createElement('span');
                            numSpan.className = 'numero-casilla';
                            numSpan.textContent = celda.number;
                            td.appendChild(numSpan);
                        } else {
                            td.innerHTML = '-';
                        }
                        break;
                    case 'vacio':
                        td.className = 'vacio';
                        break;
                    case 'centro':
                        td.className = 'centro';
                        // Obtener el contenedor del dado desde la instancia de ParchisGame
                        this.dadoElement = game.getDadoElemento(); // Usar la instancia de ParchisGame
                    
                        // Registrar el evento de clic en el dado
                        this.dadoElement.addEventListener('click', async () => {
                            if (!game.dado.animando) {
                                const valor = await game.lanzarDado(); // Lanza el dado
                                console.log(`Valor obtenido del dado: ${valor}`);
                        
                                // Ejecutar el turno del jugador actual
                                game.jugarTurno(valor, this);
                        
                                // Avanzar al siguiente turno
                                this.mostrarTurno(); // Actualizar el mensaje del turno
                            }
                        });
                    
                        td.appendChild(this.dadoElement); 
                        break;
                        
                }
    
                tr.appendChild(td);
            });
    
            table.appendChild(tr);
        });
    
        tableroContainer.appendChild(table);
    }
}

/*mostrar el tablero*/
/* Generar el tablero visualmente */
document.addEventListener('DOMContentLoaded', function () {
    const game = window.game; // Instancia de la clase ParchisGame
    const tablero = new Tablero(game); // Instancia de la clase Tablero

    // Agregar jugadores
    game.agregarJugador("Jugador 1", "rojo");
    game.agregarJugador("Jugador 2", "verde");
    game.agregarJugador("Jugador 3", "azul");
    game.agregarJugador("Jugador 4", "amarillo");
    console.log("Jugadores agregados:", game.jugadores);

    // Inicializar las fichas de los jugadores
    game.iniciarPartida();

    tablero.generarTablero(); // Generar el tablero visualmente
    tablero.mostrarTurno(); // Mostrar el turno del jugador actual
    
    // Verificar el estado de game después de agregar los jugadores
    console.log("¿Game está definido después de inicializar todo?", game);
});