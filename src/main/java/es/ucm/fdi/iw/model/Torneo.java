package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@NamedQueries({
    //Queries que vamos a usar para la tabla Torneo en la BBDD
})

@Table(name="Torneo")
public class Torneo {
    
    public enum Estado {
        En_espera,
        Cerrado,
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private long id;

    @Column
    private int numParticipantes;

    @Column
    private Estado estado;

    @Column
    private LocalTime horaInicio;

    @Column
    private LocalTime horaFin;

    @OneToMany(mappedBy = "torneo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Partida> partidas;

}
