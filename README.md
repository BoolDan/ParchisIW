# ParchisIW
Práctica de la asignatura de Ingeniería Web.

---

## Credenciales iniciales
- Usuario: a , Contraseña: aa
- Usuario: b , Contraseña: aa

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
      - **Nuevo:** Añadida una sala de espera tras crear la partida, donde los jugadores esperan hasta que el lobby esté lleno. Una vez completo, se muestran botones de "Listo/No Listo" para cada jugador y la partida no comenzará hasta que todos los jugadores estén listos.


5. **Configuración del Juego**:
   - Permite a los usuarios configurar las opciones de una nueva partida, como el número de jugadores, el modo de juego y el tipo de partida.

6. **Vista de Juego**:
   - Tablero funcional que permite a los jugadores interactuar con la partida.
   - Información de la partida con: Lista de jugadores presentes en la partida, rondas jugadas y piezas restantes para ganar la partida.
   - Chat en tiempo real para que los jugadores puedan comunicarse.

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
  - Sala de espera pre-partida que espera a que todos los jugadores estén dentro para poder empezar la partida.
  - Botón para crear una nueva partida.

---

### **Página de Configuración**
- **Implementado**:
  - Opciones para configurar el número de jugadores, modo de juego y tipo de partida.
- **Pendiente**:
  - Modo de juego por equipos y tipo de partida local.

---

### **Página de Juego**
- **Implementado**:
  - Tablero funcional que permite a los jugadores interactuar con la partida.
  - Lista de jugadores presentes en la partida.
  - **Chat en la partida**: Chat en tiempo real para que los jugadores puedan comunicarse.
- **Pendiente**:
  - Al terminar la partida te envia directamente al lobby, implementar mensaje de finalización de partida y cambiar el estado de la partida a finalizada. 
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


# Entrega post-examen

## Integrantes:
- Daniel de Andrés Fernández
- Mario Gallego Hernández
- Mauricio Nilton Calderón Barazorda

## Mejoras:
### Demasiados jugadores
- Creemos haber solucionado el problema de que mediante post a `/lobby/{id}/unirse` puedan unirse más jugadores a las partidas pero no somos capaces de reproducir el problema por lo que no lo podemos confirmar, hemos enviado un correo al profesor para poder reproducir el problema.
### Soluciones a ejercicios de examen:
- Dado tirado por el servidor: Cambiado el código para que el dado sea el valor devuelto de `/dado/{idPartida}` desde ApiController.
- Indicador en perfil: Se ha añadido un indicador en el perfil que avisa si has sido reportado (No se ha añadido la funcionalidad de contra-reporte).
- Admin puede ver partidas en curso: Hemos cambiado algunos parámetros de seguridad para permitir al administrador (y solo al administrador) observar las partidas que se encuentran en curso, aunque es capaz de ver todos los cambios en el tablero en tiempo real ya que se subscribe tanto al chat de actualizaciones de la partida como al chat de la partida, por ello también es capaz de escribir en el chat si así lo desea, no se le considera un jugador de la partida así que no tendrá piezas ni podrá tirar del dado (el aviso de no es tu turno aparece).


### Cambios extra:
- Partida iniciada: Nos habiamos dado cuenta de que al salir y entrar de la partida, al usuario se le reiniciaba el tablero y no recibía el estado de la partida correctamente reiniciando de cero una partida ya en curso. Ahora al entrar en la partida de nuevo recibe el estado de la partida correctamente y no ve el tablero vacío.


