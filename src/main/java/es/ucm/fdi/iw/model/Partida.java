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
@Data  // @Getter, @Setter, @ToString, @Equals and Hash Code, @RequiredArgsConstructor
@NoArgsConstructor
@NamedQueries({

})

@Table(name="Partida")
public class Partida {
    
    public enum ColoresPartida {
        ROJO,
        AZUL,
        VERDE,
        AMARILLO,
        NARANJA,
        MORADO
    }

    public enum EstadoPartida {
        ESPERANDO_JUGADORES,
        EN_CURSO,
        FINALIZADA
    }

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private long id;

    @Column
    private ColoresPartida colorTurno;

    @Column(nullable = false)
    private EstadoPartida estado = EstadoPartida.ESPERANDO_JUGADORES;

    @Column
    private int numJugadores;

    @Column
    private int jugadoresMax;

    @Column
    private String resultadoFinal;

    @Column
    private String movimientos_turno;
    

    public void setMovimientos(List<String> movimientos) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            this.movimientos_turno = objectMapper.writeValueAsString(movimientos);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ManyToOne
    @JoinColumn(name = "ID_torneo", nullable = false)
    private Torneo torneo;
}
