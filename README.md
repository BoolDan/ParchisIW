# ParchisIW
Práctica de la asignatura de Ingeniería Web.

---

## Integrantes
- Carlos Clemente Sánchez
- Daniel de Andrés Fernández
- Mauricio Nilton Calderón Barazorda
- Carla Acebes Montalvillo
- Mario Gallego Hernández

---

## Versión Actualizada del Proyecto

La versión actual del proyecto **ParchisIW** es una plataforma funcional que permite a los usuarios jugar partidas de Parchís en línea, gestionar torneos y administrar usuarios y reportes. El proyecto incluye las siguientes características principales:

1. **Landing Page**:
   - Página de bienvenida que presenta el juego de Parchís Online.
   - Ofrece opciones para jugar, consultar reglas y ver clasificaciones.

2. **Clasificación**:
   - Tablas de clasificación que muestran los torneos en curso y los torneos acabados.
   - Una vez seleccionado un torneo, se pueden ver los detalles del torneo, incluyendo los participantes y el estado actual.
   - Los usuarios pueden inscribirse en torneos activos directamente desde esta vista.

3. **Página de Reglas**:
   - Explicación detallada de las reglas del juego.

4. **Lobby de Partidas**:
   - Lista de partidas en espera de jugadores.
   - Botón para crear una nueva partida.

5. **Configuración del Juego**:
   - Permite a los usuarios configurar las opciones de una nueva partida, como el número de jugadores, el modo de juego y el tipo de partida.

6. **Vista de Juego**:
   - Tablero funcional que permite a los jugadores interactuar con la partida.
   - Lista de jugadores presentes en la partida.
   - **Pendiente**: Implementar un chat en tiempo real para la comunicación entre jugadores.

7. **Vista de Administrador**:
   - Gestión de usuarios: Banear/desbanear usuarios.
   - Gestión de torneos: Ver torneos en espera, en curso y finalizados.
   - Gestión de reportes: Revisar reportes enviados por los usuarios y aplicar castigos si el comportamiento del usuario no es el correcto (banear al usuario).

8. **Base de Datos Completamente Funcional**:
   - La base de datos almacena información sobre usuarios, torneos, partidas, mensajes y reportes.

9. **Servidor Desplegado**:
    - El servidor está desplegado y accesible para pruebas y demostraciones.

---

## Funcionalidades Implementadas y Pendientes

### **Landing Page - Página de Bienvenida**
- **Implementado**:
  - Botones para acceder a las diferentes secciones del juego (jugar, reglas, clasificación).
- **Pendiente**:
  - (?) Mejorar el diseño visual y agregar animaciones.

---

### **Página de Clasificación**
- **Implementado**:
  - Tablas de clasificación que muestran los torneos en curso y los torneos acabados.
  - Los usuarios pueden seleccionar un torneo para ver sus detalles, incluyendo participantes y estado.
  - Posibilidad de inscribirse en torneos activos.

---

### **Página de Reglas**
- **Implementado**:
  - Secciones que explican las reglas básicas del juego.
- **Pendiente**:
  - (?) Agregar ejemplos visuales o videos explicativos.

---

### **Lobby de Partidas**
- **Implementado**:
  - Lista de partidas en espera de jugadores.
  - Botón para crear una nueva partida.

---

### **Página de Configuración**
- **Implementado**:
  - Opciones para configurar el número de jugadores, modo de juego y tipo de partida.

---

### **Página de Juego**
- **Implementado**:
  - Tablero funcional que permite a los jugadores interactuar con la partida.
  - Lista de jugadores presentes en la partida.
- **Pendiente**:
  - **Chat en la partida**: Implementar un chat en tiempo real para que los jugadores puedan comunicarse.

---

### **Vista de Administrador**
- **Implementado**:
  - Gestión de usuarios: Banear/desbanear usuarios.
  - Gestión de torneos: Ver torneos en curso y finalizados, inscribir jugadores.
  - Gestión de reportes: Revisar reportes enviados por los usuarios y aplicar castigos si el comportamiento del usuario no es el correcto (por ejemplo, banear al usuario).
- **Pendiente**:
  - Agregar filtros búsqueda torneos.
---

### **Base de Datos**
- **Implementado**:
  - Tablas para usuarios, torneos, partidas, mensajes y reportes.
  - Consultas optimizadas para obtener información relevante.

---

### **Servidor**
- **Implementado**:
  - Servidor desplegado y accesible.
  - Integración con la base de datos y las vistas.

---

## Material Utilizado para la Implementación
- **Estilo de botones**: https://www.eniun.com/botones-css-estilos/
- **Estilo de cartas**: https://getbootstrap.com/docs/4.0/components/card/
- **Espaciado de elementos**: https://getbootstrap.com/docs/4.0/utilities/spacing/
- **Estilo del chat**: https://www.youtube.com/watch?v=3JyQ2_wBqBU
- **Columnas de Bootstrap**: https://getbootstrap.com/docs/5.0/layout/columns/
- **Estilo de botones cerrados**: https://getbootstrap.com/docs/5.3/components/close-button/
- **Emojis en HTML**: https://www.w3schools.com/html/html_emojis.asp
- **Posicionamiento en Bootstrap**: https://getbootstrap.com/docs/5.0/utilities/position/
