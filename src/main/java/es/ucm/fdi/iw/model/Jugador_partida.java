package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalTime;


@Entity
@Data
@NoArgsConstructor
@NamedQueries({

})

@Table(name="Jugador_partida")
public class Jugador_partida {

    public enum Color_Jugador{
        ROJO,
        AZUL,
        VERDE,
        AMARILLO,
        NARANJA,
        MORADO
    }

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private long id;



    @ManyToOne
    @JoinColumn(name = "ID_Partida", nullable = false)
    private Partida partida;

    @OneToOne
    @JoinColumn(name = "ID_Usuario", nullable = false)
    private User usuario;
}