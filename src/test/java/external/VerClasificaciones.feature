@tag
@aparallel: False
Feature: Funcionamiento de una partida de Parchís con 5 jugadores

  Background:
      * url 'http://localhost:8080/Clasificacion'
      * header Content-Type = 'application/json'

  Scenario: Ver la clasificacion de los torneos 
    Given request {estado: 'Cerrado'}
    Then 

  Scenario: