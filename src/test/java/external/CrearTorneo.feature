Feature: Crear torneo

  Background:
    # Login como administrador usando request POST
    Given url baseUrl + '/login'
    And request { "username": "a", "password": "aa" }
    When method post
    Then status 200
    * def loginCookies = responseCookies  # Guardamos las cookies de sesión
    * print "Cookies después de login:", loginCookies

  Scenario: Crear un torneo con datos correctos
    # Crear un torneo usando request POST
    Given url baseUrl + '/torneos/crear'
    And request { 
      "nombre": "Torneo Karate Test",
      "horaInicio": "10:00",
      "horaFin": "12:00"
    }
    And cookies loginCookies  # Usamos las cookies de la sesión de login
    When method post
    Then status 302  # Redirección esperada después de crear el torneo
    And match responseHeaders['Location'] contains '/torneos/clasificacionTorneos'

    # Verificar que el torneo aparece en la lista de torneos
    Given url baseUrl + '/torneos/clasificacionTorneos'
    When method get
    Then status 200
    And match response contains { "nombre": "Torneo Karate Test", "estado": "En_espera" }
