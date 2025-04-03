document.addEventListener('DOMContentLoaded', function() {
    const tablero = document.getElementById('tablero');
    
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
            { type: 'pasillo', color: 'amarillo', colspan: 2 },
            { type: 'casilla', number: 66, colspan: 2 },
            null
        ],
        // Fila 3
        [
            null,
            { type: 'casilla', number: 3, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', colspan: 2 },
            { type: 'casilla', number: 65, colspan: 2 },
            null
        ],
        // Fila 4
        [
            null,
            { type: 'casilla', number: 4, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', colspan: 2 },
            { type: 'casilla', number: 64, colspan: 2 },
            null
        ],
        // Fila 5
        [
            null,
            { type: 'pasillo', color: 'amarillo', number: 5, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', colspan: 2 },
            { type: 'casilla', number: 63, colspan: 2 },
            null
        ],
        // Fila 6
        [
            null,
            { type: 'casilla', number: 6, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', colspan: 2 },
            { type: 'casilla', number: 62, colspan: 2 },
            null
        ],
        // Fila 7
        [
            null,
            { type: 'casilla', number: 7, colspan: 2 },
            { type: 'pasillo', color: 'amarillo', colspan: 2 },
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
            { type: 'pasillo', color: 'amarillo'},
            { type: 'pasillo', color: 'amarillo'},
            { type: 'casilla', number: 60 },
            { type: 'vacio' },
            { type: 'casilla', number: 58, rowspan: 2 },
            { type: 'casilla', number: 57, rowspan: 2 },
            { type: 'pasillo', color: 'verde', number: 56, rowspan: 2 },
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
            { type: 'pasillo', color: 'azul', rowspan: 2 },
            { type: 'pasillo', color: 'azul', rowspan: 2 },
            { type: 'pasillo', color: 'azul', rowspan: 2 },
            { type: 'pasillo', color: 'azul', rowspan: 2 },
            { type: 'pasillo', color: 'azul', rowspan: 2 },
            { type: 'pasillo', color: 'azul', rowspan: 2 },
            { type: 'pasillo', color: 'azul' },
            { type: 'pasillo', color: 'verde' },
            null, null, null,
            { type: 'pasillo', color: 'verde', rowspan: 2 },
            { type: 'pasillo', color: 'verde', rowspan: 2 },
            { type: 'pasillo', color: 'verde', rowspan: 2 },
            { type: 'pasillo', color: 'verde', rowspan: 2 },
            { type: 'pasillo', color: 'verde', rowspan: 2 },
            { type: 'pasillo', color: 'verde', rowspan: 2 },
            { type: 'casilla', number: 51, rowspan: 2 }
        ],
        // Fila 11
        [
            null, null, null, null, null, null, null,
            { type: 'pasillo', color: 'azul'},
            { type: 'pasillo', color: 'verde'},
            null, null, null, null, null, null, null, null
        ],
        // Fila 12
        [
            { type: 'casilla', number: 18, rowspan: 2 },
            { type: 'casilla', number: 19, rowspan: 2 },
            { type: 'casilla', number: 20, rowspan: 2 },
            { type: 'casilla', number: 21, rowspan: 2 },
            { type: 'pasillo', color: 'azul', number: 22, rowspan: 2 },
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
            { type: 'pasillo', color: 'rojo'},
            { type: 'pasillo', color: 'rojo' },
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
            { type: 'pasillo', color: 'rojo', colspan: 2 },
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
            { type: 'pasillo', color: 'rojo', colspan: 2 },
            { type: 'casilla', number: 40, colspan: 2 },
            null
        ],
        // Fila 16
        [
            null,
            { type: 'casilla', number: 29, colspan: 2 },
            { type: 'pasillo', color: 'rojo', colspan: 2 },
            { type: 'pasillo', color: 'rojo', number: 39, colspan: 2 },
            null
        ],
        // Fila 17
        [
            null,
            { type: 'casilla', number: 30, colspan: 2 },
            { type: 'pasillo', color: 'rojo', colspan: 2 },
            { type: 'casilla', number: 38, colspan: 2 },
            null
        ],
        // Fila 18
        [
            null,
            { type: 'casilla', number: 31, colspan: 2 },
            { type: 'pasillo', color: 'rojo', colspan: 2 },
            { type: 'casilla', number: 37, colspan: 2 },
            null
        ],
        // Fila 19
        [
            null,
            { type: 'casilla', number: 32, colspan: 2 },
            { type: 'pasillo', color: 'rojo', colspan: 2 },
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

    // Crear la tabla
    const table = document.createElement('table');
    table.setAttribute('border', '1px');

    // Generar filas
    estructura.forEach((fila, filaIndex) => {
        const tr = document.createElement('tr');
        
        fila.forEach((celda, celdaIndex) => {
            if (celda === null) return;
            console.log(`Procesando celda en fila ${filaIndex}, columna ${celdaIndex}:`, celda);

            const td = document.createElement('td');
            
            if (celda.colspan) td.colSpan = celda.colspan;
            if (celda.rowspan) td.rowSpan = celda.rowspan;
            
            switch(celda.type) {
                case 'casa':
                    td.className = celda.color;
                    // Añadir fichas a la casa
                    if (celda.tokens) {
                        celda.tokens.forEach(token => {
                            const tokenElement = document.createElement('div');
                            tokenElement.className = `token ${token.color}`;
                            tokenElement.textContent = token.number;
                            tokenElement.style.left = `${token.x}px`;
                            tokenElement.style.top = `${token.y}px`;
                            tokenElement.addEventListener('click', function() {
                                console.log(`Ficha ${token.number} del jugador ${token.color}`);
                            });
                            td.appendChild(tokenElement);
                        });
                    }
                    break;
                case 'casilla':
                    const numSpan = document.createElement('span');
                    numSpan.className = 'numero-casilla';
                    numSpan.textContent = celda.number;
                    td.appendChild(numSpan);
                    break;
                case 'pasillo':
                    td.className = celda.color || '';
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
                    td.id = 'vacio';
                    break;
                case 'centro':
                    td.className = 'centro';
                    console.log("Celda de tipo 'centro' encontrada.");

                    try {
                        const dado = new Dado();
                        const dadoElemento = dado.getElemento();
                        if (!dadoElemento) {
                            console.error("El método getElemento() no devolvió un elemento válido.");
                        } else {
                            console.log("Dado creado correctamente.");
                            td.appendChild(dadoElemento);
                        }
                    } catch (error) {
                        console.error("Error al crear o agregar el dado:", error);
                    }
                    break;
        }
            
            tr.appendChild(td);
        });
        
        table.appendChild(tr);
    });

    tablero.appendChild(table);
});