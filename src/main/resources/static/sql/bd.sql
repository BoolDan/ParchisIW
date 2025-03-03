CREATE TABLE Usuario (
    ID IDENTITY PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(10) NOT NULL CHECK (rol IN ('admin', 'jugador')),
    correo VARCHAR(100) UNIQUE NOT NULL,
    estado VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (estado IN ('baneado', 'normal')),
    país VARCHAR(50) NOT NULL
);

CREATE TABLE Partida (
    ID IDENTITY PRIMARY KEY,
    ID_torneo INT NULL,
    color_turno VARCHAR(10) NOT NULL CHECK (color_turno IN ('rojo', 'azul', 'verde', 'amarillo')),
    estado VARCHAR(20) NOT NULL DEFAULT 'esperando jugadores' CHECK (estado IN ('esperando jugadores', 'en curso', 'finalizada')),
    numero_jugadores INT NOT NULL,
    jugadores_maximos INT NOT NULL,
    resultado_final INT NULL,
    informacion_partida VARCHAR(2000) NOT NULL, -- H2 no reconoce json como tipo, por lo que almacenamos en VARCHAR como texto 
    FOREIGN KEY (ID_torneo) REFERENCES Torneo(ID) ON DELETE SET NULL
);

CREATE TABLE Jugador_Partida (
    ID_jugador_Partida IDENTITY PRIMARY KEY,
    ID_Partida INT NOT NULL,
    ID_usuario INT NOT NULL,
    color_ficha VARCHAR(20) NOT NULL CHECK (color_ficha IN ('rojo', 'azul', 'verde', 'amarillo')),
    FOREIGN KEY (ID_Partida) REFERENCES Partida(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_usuario) REFERENCES Usuario(ID) ON DELETE CASCADE
);

CREATE TABLE Torneo (
    ID IDENTITY PRIMARY KEY,
    estado VARCHAR(20) NOT NULL DEFAULT 'En espera' CHECK (estado IN ('en espera', 'cerrado')),
    numero_participantes INT NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NULL
);

CREATE TABLE Jugador_Torneo (
    ID_jugador_torneo IDENTITY PRIMARY KEY,
    ID_torneo INT NOT NULL,
    ID_usuario INT NOT NULL,
    puntuación INT NOT NULL DEFAULT 0,
    FOREIGN KEY (ID_torneo) REFERENCES Torneo(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_usuario) REFERENCES Usuario(ID) ON DELETE CASCADE
);


CREATE TABLE Mensaje (
    ID IDENTITY PRIMARY KEY,
    ID_usuario INT NOT NULL,
    ID_partida INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL,
    reporte VARCHAR(30) NOT NULL DEFAULT 'no reportado' CHECK (reporte IN ('no reportado', 'reportado')),
    FOREIGN KEY (ID_usuario) REFERENCES Usuario(ID) ON DELETE CASCADE,
    FOREIGN KEY (ID_partida) REFERENCES Partida(ID) ON DELETE CASCADE
);
