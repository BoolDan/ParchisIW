# ParchisIW
Practica de la asignatura de Ingenieria Web.

## Integrantes
- Carlos Clemente Sánchez
- Daniel de Andrés Fernández
- Mauricio Nilton Calderón Barazorda
- Carla Acebes Montalvillo
- Mario Gallego Hernández

## Versión actual
La versión actualmente desarrollada de la aplicación funciona como una demostración visual preliminar, diseñada para presentar la estructura y el flujo básico de la interfaz de usuario. En esta fase, las funcionalidades completas no están implementadas, pero se han establecido los fundamentos para su posterior desarrollo e integración.

La aplicación incluye los siguientes componentes clave:

1. **Landing Page**: Esta página sirve como punto de entrada principal, donde los usuarios pueden obtener una visión general de la aplicación y acceder a las diferentes secciones disponibles.

2. **Clasificación**: Se ha incorporado una sección que muestra una clasificación, la cual, en futuras iteraciones, podría reflejar el rendimiento de los jugadores, puntuaciones o logros dentro del juego. Incluye dos botones los cuales diferencia la clasificacion de manera global  de manera local dependiendo de la localización del jugador

3. **Página de Reglas**: Aquí se presenta una explicación detallada de las reglas del juego, proporcionando a los usuarios la información necesaria para entender cómo jugar.

4. **Lobby de Partidas**: Esta área permite a los usuarios visualizar y seleccionar partidas disponibles. Aunque actualmente es una vista estática, está diseñada para facilitar la interacción y la creación de partidas en futuras versiones.

5. **Vista de Juego**: Se ha implementado una vista preliminar donde se simula la experiencia de jugar una partida. Esta sección está preparada para integrar las mecánicas de juego y la interacción en tiempo real en próximas actualizaciones. Cuenta con la vista del tablero sobre el que se juega además de un chat con el que poder conmunicarse con el resto de jugadores, los cuales son visibles en la lista de jugadores. 

6. **Vista de Administrador**: Se ha modificado la página de administrador previamente dada para que se muestren todos los usuarios, partidas y reportes que tendremos almacenados en la base de datos.

## Funcionalidades
## Landing Page - Página de Bienvenida

Esta vista está diseñada para presentar el juego de Parchís Online, ofrecer opciones de juego (multijugador o contra la IA), y proporcionar información sobre cómo jugar y otras características adicionales del juego como la clasificación de jugadores.

- El botón ***¡Empieza a jugar!*** permite a los usuarios comenzar una partida de Parchís.
- El botón ***Juega Multijugador o Desafía a la IA*** permite acceder a la lobby de lista de partidas.
- El botón ***Cómo jugar*** permite acceder a la página donde se encuentran las reglas del juego.
- El botón ***Clasificación de jugadores*** permite acceder a la clasificación de jugadores.

## Vista de Administrador - Requerido rol de Administrador

Vista diseñada para que los admins puedan realizar sus funciones propias de administración de nuestro juego. Esta vista está conformada por:

- Una columna de ***Usuarios*** que mostrará todos los usuarios que tendremos almacenados. Cada usuario estará en un botón que llevará a su usuario.
- Una columna de ***Partidas*** que mostrará botones con todas las partidas jugadas por nuestros usuarios. Al clickar en una partida se podrá observar lo ocurrido en la partida.
- Una columna de ***Reportes*** que mostrará botones con todos los reportes creados por los usuarios. En el título estará la razón por la que se manda el reporte y la fecha de creación.

Material utilizado para la implementación:
- Estilo de botones: https://www.eniun.com/botones-css-estilos/
- Estilo de cartas: https://getbootstrap.com/docs/4.0/components/card/
- Espacio de elementos: https://getbootstrap.com/docs/4.0/utilities/spacing/

## Página de juego - Requerido rol de usuario

Vista de juego que permite al usuario interactuar con el tablero así como observar los jugadores que se encuentran dentro de la sala de juego e interactuar con ellos usando el chat, distribuidos usando Bootstrap 5.3 columns. Así esta vista cuenta con los siguientes elementos:

- Una columna que contiene un ***Chat Interactivo*** que permite a los usuarios enviar y recibir mensajes de todos los participantes de una partida.
- Una columna que contiene la ***Vista del Tablero*** que permitirá al usuario interactuar con la partida, además de un botón ***Salir de la Partida*** que permitirá al usuario abandonar la partida si así lo desean.
- Una columna que contiene la ***Lista de Usuarios*** que permitirá al usuario ver los jugadores presentes en la partida. 

## Página de Clasificación

Vista diseñada para que los jugadores puedan ver su puntuación y comparar esta con otros jugadores. Conformada por: 

-   ***Tabla de Clasificación***: Muestra la posición, nombre y puntos de los jugadores divididos en tres columnas.
-   ***Botones de Filtro***: Alterna entre la clasificación local y global.

Material utilizado para la implementación:
- Estilo del chat: https://www.youtube.com/watch?v=3JyQ2_wBqBU
- Columnas de bootstrap: https://getbootstrap.com/docs/5.0/layout/columns/
- Estilo de botones: https://getbootstrap.com/docs/5.3/components/close-button/
- Emojis en html: https://www.w3schools.com/html/html_emojis.asp
- Posicion bootstrap: https://getbootstrap.com/docs/5.0/utilities/position/

## Página de configuración - Requerido rol de usuario

Vista que permite a los usuarios configurar sus partidas en cuanto al numero de jugadores modo de juego y el tipo de partida. Contiene los siguientes elementos:

- Una tabla en la que se engloban las opciones disponibles para los usuarios.
- Un selector de tipo drop down en la que se selecciona el número de jugadores.
- Dos selectores de tipo selector circular para confirmar el modo de juego y el tipo de partida.


