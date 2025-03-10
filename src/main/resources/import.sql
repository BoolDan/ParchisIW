-- insert admin (username a, password aa)
INSERT INTO Usuario (id, enabled, roles, username, password)
VALUES (1, TRUE, 'ADMIN,USER', 'a',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W');
INSERT INTO Usuario (id, enabled, roles, username, password)
VALUES (2, TRUE, 'USER', 'b',
    '{bcrypt}$2a$10$2BpNTbrsarbHjNsUWgzfNubJqBRf.0Vz9924nRSHBqlbPKerkgX.W');

-- Insertar un torneo en estado "En espera" sin fecha de finalización
INSERT INTO Torneo (estado, numero_participantes, fecha_inicio, fecha_fin)
VALUES ('En espera', 8, '2025-03-10 14:00:00', NULL);

-- Insertar un torneo en estado "Cerrado" con fecha de inicio y fin definidas
INSERT INTO Torneo (estado, numero_participantes, fecha_inicio, fecha_fin)
VALUES ('Cerrado', 10, '2025-03-08 10:00:00', '2025-03-08 12:00:00');

-- Insertar otro torneo en estado "En espera" para un torneo futuro
INSERT INTO Torneo (estado, numero_participantes, fecha_inicio, fecha_fin)
VALUES ('En espera', 12, '2025-03-11 09:30:00', NULL);

-- Insertar un torneo "Cerrado" con menos participantes y fechas concretas
INSERT INTO Torneo (estado, numero_participantes, fecha_inicio, fecha_fin)
VALUES ('Cerrado', 6, '2025-03-09 15:45:00', '2025-03-09 17:30:00');

-- Insertar un torneo en estado "En espera" con pocos participantes
INSERT INTO Torneo (estado, numero_participantes, fecha_inicio, fecha_fin)
VALUES ('En espera', 4, '2025-03-10 18:00:00', NULL);

-- start id numbering from a value that is larger than any assigned above
ALTER SEQUENCE "PUBLIC"."GEN" RESTART WITH 1024;


