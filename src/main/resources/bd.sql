CREATE DATABASE Parchis;
USE Parchis;

CREATE TABLE Usuarios (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña_hash VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Jugador') NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    estado ENUM('baneado', 'normal') NOT NULL DEFAULT 'normal',
    país VARCHAR(50) NOT NULL
);

CREATE TABLE Partida (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_torneo INT NULL,
    color_turno ENUM('Rojo', 'Azul', 'Verde', 'Amarillo') NOT NULL,
    estado ENUM('Esperando jugadores', 'En curso', 'Finalizada') NOT NULL DEFAULT 'Esperando jugadores',
    numero_jugadores INT NOT NULL,
    jugadores_maximos INT NOT NULL,
    resultado_final TEXT NULL,
    FOREIGN KEY (ID_torneo) REFERENCES Torneo(ID) ON DELETE SET NULL
);

CREATE TABLE Jugador_Partida (
    ID_jugador_Partida INT AUTO_INCREMENT PRIMARY KEY,
    ID_Partida INT NOT NULL,
    ID_usuario INT NOT NULL,
    color_ficha ENUM('Rojo', 'Azul', 'Verde', 'Amarillo') NOT NULL,
    estado_juego JSON NOT NULL,
    FOREIGN KEY (ID_Partida) REFERENCES Partida(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

CREATE TABLE Torneo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    estado ENUM('En espera', 'Cerrado') NOT NULL DEFAULT 'En espera',
    numero_participantes INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NULL
);

CREATE TABLE Jugador_Torneo (
    ID_jugador_torneo INT AUTO_INCREMENT PRIMARY KEY,
    ID_torneo INT NOT NULL,
    ID_usuario INT NOT NULL,
    puntuación INT NOT NULL DEFAULT 0,
    FOREIGN KEY (ID_torneo) REFERENCES Torneo(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

CREATE TABLE Clasificación (
    ID_clasificación INT AUTO_INCREMENT PRIMARY KEY,
    ID_usuario INT NOT NULL,
    ID_torneo INT NOT NULL,
    puntos INT NOT NULL,
    posición INT NOT NULL,
    tipo_clasificación VARCHAR(50) NOT NULL,
    fecha_actualización DATETIME NOT NULL,
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_torneo) REFERENCES Torneo(ID) ON DELETE CASCADE
);

CREATE TABLE Mensaje (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_usuario INT NOT NULL,
    ID_partida INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL,
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_partida) REFERENCES Partida(ID) ON DELETE CASCADE
);

CREATE TABLE Reporte (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_usuario INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_reporte DATETIME NOT NULL,
    estado ENUM('Aceptado', 'Denegado') NOT NULL DEFAULT 'Denegado',
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

CREATE TABLE Usuarios_Baneados (
    ID_tabla INT AUTO_INCREMENT PRIMARY KEY,
    ID_usuario_baneado INT NOT NULL,
    ID_usuario_emisor INT NOT NULL,
    motivo TEXT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    FOREIGN KEY (ID_usuario_baneado) REFERENCES Usuarios(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_usuario_emisor) REFERENCES Usuarios(ID) ON DELETE CASCADE
);
