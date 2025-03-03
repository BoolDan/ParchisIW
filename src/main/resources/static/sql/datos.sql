-- Insertar Usuarios
INSERT INTO Usuario (nombre_usuario, contraseña, rol, correo, estado, país) VALUES
('a', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W', 'admin', 'a@email.com', 'normal', 'Argentina'),
('b', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerksX.W', 'jugador', 'b@email.com', 'normal', 'Brasil'),
('c', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz992snRSHBqlbPKerksX.W', 'admin', 'c@email.com', 'normal', 'China'),
('d', '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz992wnRSHBqlbPKerksX.W', 'jugador', 'd@email.com', 'baneado', 'Dinamarca');


-- Insertar Torneos
INSERT INTO Torneo (estado, numero_participantes, fecha_inicio, fecha_fin) VALUES
('en espera', 16, '2025-03-10 12:00:00', NULL),
('cerrado', 8, '2025-02-15 10:00:00', '2025-02-20 18:00:00');

-- Insertar Partidas
INSERT INTO Partida (ID_torneo, color_turno, estado, numero_jugadores, jugadores_maximos, resultado_final, informacion_partida) VALUES
(1, 'rojo', 'esperando jugadores', 2, 4, NULL, '{"turno":1, "tablero":{}}'),
(2, 'azul', 'finalizada', 4, 4, 1, '{"ganador": "jugador1", "movimientos":[]}');

-- Insertar Jugadores en Partidas
INSERT INTO Jugador_Partida (ID_Partida, ID_usuario, color_ficha) VALUES
(1, 2, 'rojo'),
(1, 1, 'azul');

-- Insertar Jugadores en Torneos
INSERT INTO Jugador_Torneo (ID_torneo, ID_usuario, puntuación) VALUES
(1, 2, 100),
(2, 1, 200);

-- Insertar Mensajes en Partidas
INSERT INTO Mensaje (ID_usuario, ID_partida, contenido, fecha_envio, reporte) VALUES
(2, 1, '¡Buena suerte!', '2025-03-10 12:05:00', 'no reportado'),
(1, 1, '¡Vamos a ganar!', '2025-03-10 12:06:00', 'no reportado');
