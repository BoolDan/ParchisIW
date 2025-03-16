@tag
@aparallel: False
Feature: Funcionamiento de una partida de Parchís con 5 jugadores

  @tag1
  Scenario: Enviar y recibir mensajes en el chat de partida
    Given el usuario está en la partida con 5 jugadores
    When escribe un mensaje en el chat "¡Buena suerte a todos!"
    And envía el mensaje
    Then todos los oponentes deben recibir el mensaje
    And cada oponente responde con un mensaje de bienvenida
    And el usuario ve las respuestas en el chat
  @tag2
  Scenario: Tirar el dado y mover una ficha
    Given es el turno del usuario
    When presiona el botón para tirar el dado
    And el sistema devuelve un número entre 1 y 6
    And el usuario selecciona una de sus fichas en juego
    And mueve la ficha según el número obtenido
    Then el turno pasa al siguiente jugador
  @tag3
  Scenario: Tirar un cinco y comprobar reglas de salida
    Given es el turno del usuario
    When presiona el botón para tirar el dado
    And el sistema devuelve un 5
    Then el sistema verifica si hay fichas en "casa"
    And si hay fichas en casa, el sistema fuerza a seleccionar una para salir
    And si no hay fichas en casa, el usuario puede mover cualquier ficha
    And el turno pasa al siguiente jugador
  @tag4
  Scenario: Abandonar la partida
    Given el usuario desea salir de la partida
    When presiona el botón "Salir de la partida"
    Then el sistema muestra una ventana pop-up de confirmación
    And el usuario debe confirmar su salida para abandonar la partida
