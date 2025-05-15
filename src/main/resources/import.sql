-- insert admin (username a, password aa)
INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (1, TRUE, 'ADMIN,USER', 'a',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'Esp', 'a@gmail.com');

INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (2, TRUE, 'USER', 'b',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'En', 'b@gmail.com');

INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (3, TRUE, 'USER', 'c',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'Esp', 'c@gmail.com');

    INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (4, TRUE, 'USER', 'd',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'Esp', 'd@gmail.com');
    
INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (5, TRUE, 'USER', 'e',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'Esp', 'e@gmail.com');

INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (6, TRUE, 'USER', 'f',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'Esp', 'f@gmail.com');

INSERT INTO Usuario (id, enabled, roles, username, password, pais, correo)
VALUES (7, TRUE, 'USER', 'g',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'Esp', 'g@gmail.com');

-- Consultas para probar insertar torneos
INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (3, 'Torneo Primavera', 0, NULL, 0, 'En_espera', '14:00:00', NULL);

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (2, 'Torneo Verano', 8, 'Juan Pérez', 150, 'Cerrado', '10:30:00', '12:30:00');

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (4, 'Torneo ABD', 0, 'Ana Gomez', 200, 'Cerrado', '09:00:00', '22:30:00');

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (1, 'Torneo Otoño', 0, NULL, 0, 'En_espera', '16:00:00', NULL);

-- Consultas para partidas
INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (1, 'ROJO', 'ESPERANDO_JUGADORES', 2, 4, NULL, 'PRIMER MOVIMIENTO CHOTO', 1);

INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (2, 'VERDE', 'EN_CURSO', 3, 4, NULL, 'NO SE', 2);

INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (3, 'AMARILLO', 'FINALIZADA', 4, 4, 'PRIMER LUGAR: NO SE', NULL, 4);

INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (4, 'AZUL', 'EN_CURSO', 5, 6, 'ALE', NULL, 3);

-- Consultas para Jugador_partida

-- Jugadores en la partida con id 1 (2 jugadores)
INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (1, 1, 1);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (2, 1, 2);

-- Jugadores en la partida con id 2 (3 jugadores)
INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (3, 2, 1);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (4, 2, 2);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (5, 2, 3);

-- Jugadores en la partida con id 3 (4 jugadores)
INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (6, 3, 1);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (7, 3, 2);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (8, 3, 3);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (9, 3, 4);

-- Jugadores en la partida con id 4 (5 jugadores)
INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (10, 4, 1);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (11, 4, 2);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (12, 4, 3);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (13, 4, 4);

INSERT INTO Jugador_partida (id, id_partida, id_usuario) 
VALUES (14, 4, 5);

-- Consultas para Mensajes
INSERT INTO Mensaje (id, id_usuario, id_partida, text, date_sent, fecha_reporte, reported) 
VALUES (1, 1, 1, 'QUE HACES', '2025-03-17 14:30:00', '2025-03-17 14:50:00', TRUE);

INSERT INTO Mensaje (id, id_usuario, id_partida, text, date_sent, fecha_reporte, reported) 
VALUES (2, 2, 2, 'BORRA BRO', '2025-03-16 10:30:00', NULL, TRUE);

INSERT INTO Mensaje (id, id_usuario, id_partida, text, date_sent, fecha_reporte, reported) 
VALUES (3, 1, 3, 'BUENA PARTIDA', '2025-03-14 12:30:00', NULL, TRUE);

-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;


-- Consultas para probar insertar jugadores en torneos

-- INSERT INTO Jugador_torneo (id, id_usuario, id_torneo, puntuacion)
-- VALUES (1, 2, 1, 100);

-- INSERT INTO Jugador_torneo (id, id_usuario, id_torneo, puntuacion)
-- VALUES (2, 2, 2, 50);

-- INSERT INTO Jugador_torneo (id, id_usuario, id_torneo, puntuacion)
-- VALUES (3, 3, 2, 0);


