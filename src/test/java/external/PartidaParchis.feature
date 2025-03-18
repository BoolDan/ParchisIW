@tag
@aparallel: False
Feature: Funcionamiento de una partida de Parchís con 5 jugadores

  Background:
      * url 'http://localhost:8080/game'
      * header Content-Type = 'application/json'

  #Este escenario muestra como el usuario puedee enviar mensajes por el chat      
  @tag1
  Scenario: Enviar un mensaje
    Given request { "from": "usuario1", "to": "usuario2", "text": "Hola, ¿cómo estás?", "sent": "2025-03-17T10:00:00" }
    When method POST
    Then status 200
    And match response.id != null
    And match response.text == "Hola, ¿cómo estás?"

#Este escenario muestra como el usuario recibe los mensajes del chat 
  @tag2
  Scenario: Recibir mensajes
    Given path 'usuario2/mensajes'
    When method GET
    Then status 200
    And match response[0].from == "usuario1"
    And match response[0].to == "usuario2"
    And match response[0].text == "Hola, ¿cómo estás?"
    And match response[0].sent != null

#Este escenario describe el uso del dado por el usuario
  @tag3
  Scenario: Tirar el dado
  #Mientras sea el turno del usuario puede usar el boton para tirar del dado.
    Given path 'partida/dado'
    And Partida.ColorTurno == color_usuario
    When method GET
    Then status 200
    #El valor del dado debe ser mayor o igual a 1 y menor o igual a 6
    And match response.valor >= 1
    And match response.valor <= 6
  
#Este escenario muestra los pasos que tiene que seguir el usuario para mover ficha
  @tag4
  Scenario: Mover ficha
    #Se hace una distinción ya que si el usuario saca un 5 y todavía tiene fichas en reserva(casa), esta obligado a sacar una ficha.
    #Si el usuario saca un número diferente a 5 o ya no le quedan fichas en reserva entonces puede mover las fichas de su tablero como prefiera,
    Given dado.valor == 5
    And fichas_en_casa > 0 
    Then request {'jugador': 'usuario1', 'movimientos': 'salir de casa'}
    Given dado.valor != 5
    Then request { "jugador": "usuario1", "movimiento": "mover ficha" }
    When method POST
    Then status 200
    #El usuario ve su ficha moverse en tiempo real, sin necesidad de que el juego muestre un mensaje de confirmación

#Este escenario recoge la interacción que debe seguir el usuario para salir de una partida que se encuentre en proceso.
  @tag5
  Scenario: Abandonar la partida
    Given path 'partida/salir/usuario1'
    When method POST
    Then status 200
    And match response.resultado == "Usuario1 ha abandonado la partida"
    #Este mensaje se muestra en una ventana auxiliar, y esperará confirmación del usuario para cerrarse
