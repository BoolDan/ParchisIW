Feature: Creación de partida de Parchís

  Scenario Outline: Crear una nueva partida de Parchís
    Given el usuario está en la página de creación de partida
    When selecciona el número de jugadores "<num_jugadores>"
    And selecciona el modo de juego "<modo_juego>"
    And selecciona el tipo de partida "<tipo_partida>"
    And presiona el botón de "Crear Partida"
    Then la partida debe crearse exitosamente con los parámetros seleccionados
    And se debe mostrar el mensaje "Partida creada con éxito"

    Examples:
      | num_jugadores | modo_juego | tipo_partida |
      | 2            | clásica    | local       |
      | 3            | por equipos | en línea    |
      | 4            | clásica    | en línea    |
      | 5            | por equipos | local       |
      | 6            | clásica    | en línea    |
