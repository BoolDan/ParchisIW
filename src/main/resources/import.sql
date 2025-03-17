-- insert admin (username a, password aa)
INSERT INTO Usuario (id, enabled, roles, username, password)
VALUES (1, TRUE, 'ADMIN,USER', 'a',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W');
INSERT INTO Usuario (id, enabled, roles, username, password)
VALUES (2, TRUE, 'USER', 'b',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W');

INSERT INTO Usuario (id, enabled, roles, username, password)
VALUES (3, TRUE, 'USER', 'c',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W');

-- Consultas para probar insertar torneos
INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (3, 'Torneo Primavera', 16, NULL, 0, 'En_espera', '14:00:00', NULL);

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (2, 'Torneo Verano', 8, 'Juan Pérez', 150, 'Cerrado', '10:30:00', '12:30:00');

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (4, 'Torneo ABD', 8, 'Ana Gomez', 200, 'Cerrado', '09:00:00', '22:30:00');

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (1, 'Torneo Otoño', 32, NULL, 0, 'En_espera', '16:00:00', NULL);

-- Consultas para partidas
INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (1, 'ROJO', 'ESPERANDO_JUGADORES', 2, 4, NULL, 'PRIMER MOVIMIENTO CHOTO', 1);

INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (2, 'VERDE', 'EN_CURSO', 3, 4, NULL, 'NO SE', 2);

INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (3, 'AMARILLO', 'FINALIZADA', 4, 4, 'PRIMER LUGAR: NO SE', NULL, 4);

INSERT INTO Partida (id, color_turno, estado, num_jugadores, jugadores_max, resultado_final, movimientos_turno, id_torneo)
VALUES (4, 'AZUL', 'EN_CURSO', 3, 6, 'ALE', NULL, 3);

-- Consultas para Mensajes
--INSERT INTO Mensaje (id, id_usuario, id_partida, text, data_sent, fecha_reporte, reported) 
--VALUES (1, 1, )


-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;


-- Consultas para probar insertar jugadores en torneos

INSERT INTO Jugador_torneo (id, id_usuario, id_torneo, puntuacion)
VALUES (1, 2, 1, 100);

INSERT INTO Jugador_torneo (id, id_usuario, id_torneo, puntuacion)
VALUES (2, 2, 2, 50);

INSERT INTO Jugador_torneo (id, id_usuario, id_torneo, puntuacion)
VALUES (3, 3, 2, 0);
