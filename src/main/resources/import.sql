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

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (3, 'Torneo Primavera', 16, NULL, 0, 'En_espera', '14:00:00', NULL);

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (2, 'Torneo Verano', 8, 'Juan Pérez', 150, 'Cerrado', '10:30:00', '12:30:00');

INSERT INTO Torneo (id, nombre, num_Participantes, ganador, puntos, estado, hora_Inicio, hora_Fin) 
VALUES (1, 'Torneo Otoño', 32, NULL, 0, 'En_espera', '16:00:00', NULL);


-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;


