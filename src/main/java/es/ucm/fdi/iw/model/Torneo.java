package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
    @NamedQuery(name = "Torneo.getEnJuego", query = "SELECT t FROM Torneo t WHERE t.estado = 'En_espera'"),
    @NamedQuery(name = "Torneo.getAcabados", query = "SELECT t FROM Torneo t WHERE t.estado = 'Cerrado'"),
    @NamedQuery(name = "Torneo.getEnCurso", query = "SELECT t FROM Torneo t WHERE t.estado = 'En_curso'")
})
@Table(name = "Torneo")
public class Torneo implements Transferable<Torneo.Transfer> {
    
    public enum EstadoTorneo {
        En_espera,  // Torneos en espera
        En_curso,   // Torneos en curso
        Cerrado     // Torneos finalizados
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private int numParticipantes;

    @Column
    private String ganador; 

    @Column
    private int puntos; 

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoTorneo estado;

    @Column
    private LocalTime horaInicio;

    @Column
    private LocalTime horaFin;

    // Relación 1 Torneo -> muchas Partidas
    @OneToMany(mappedBy = "torneo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Partida> partidas = new ArrayList<>();

    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private long id;
        private String nombre;
        private String estado;
        private int numParticipantes;
        private String ganador;
        private int puntos;
        private LocalTime horaInicio;
        private LocalTime horaFin;
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(id, nombre, estado.name(),
                            numParticipantes, ganador, puntos, horaInicio, horaFin);
    }

    @Override
    public String toString() {
        return toTransfer().toString();
    }
}
