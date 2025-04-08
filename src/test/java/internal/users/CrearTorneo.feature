Feature: Crear torneo

  Background:
  * def baseUrl = 'http://localhost:8080'
  
  Scenario: Crear un torneo con datos correctos
    # Login como administrador usando request POST
    Given url baseUrl + '/login'
    * def user = 
    """
    {
      "username": "a",
      "password": "aa"
    }
    """
    And request user
    When method post
    Then status 200

    # Crear un torneo usando request POST
    Given url baseUrl + '/torneos/crear'  
    * def torneo = 
    """
    {
      "nombre": "Torneo Karate Test",
      "horaInicio": "10:00",
      "horaFin": "12:00"
    }
    """
    And request torneo
    When method post
    Then status 302
    And match responseHeaders['Location'] contains '/torneos/clasificacionTorneos'

    # Verificar que el torneo aparece en la lista de torneos
    Given url baseUrl + '/torneos/clasificacionTorneos'  
    When method get
    Then status 200
    And match response contains { 'nombre': 'Torneo Karate Test', 'estado': 'En_espera' }
