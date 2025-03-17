package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
    // Query para obtener los jugadores de un torneo
    @NamedQuery(
        name = "Jugador_torneo.findByTorneo",
        query = "SELECT jt FROM Jugador_torneo jt WHERE jt.torneo.id = :torneoId"
    ),
    // Query para obtener los torneos en los que participa un usuario
    @NamedQuery(
        name = "Jugador_torneo.findByUsuario",
        query = "SELECT jt FROM Jugador_torneo jt WHERE jt.usuario.id = :usuarioId"
    ),
    // Query para obtener los jugadores de un torneo ordenados por puntuación
    @NamedQuery(
        name = "Jugador_torneo.findTopPlayersByTorneo",
        query = "SELECT jt FROM Jugador_torneo jt WHERE jt.torneo.id = :torneoId ORDER BY jt.puntuacion DESC"
    ),
    // Query para ver si un usuario ya está inscrito en un torneo
    @NamedQuery(
        name = "Jugador_torneo.countByTorneoAndUsuario",
        query = "SELECT COUNT(jt) FROM Jugador_torneo jt WHERE jt.torneo.id = :torneoId AND jt.usuario.id = :usuarioId"
    )
})

@Table(name="Jugador_torneo")
public class Jugador_torneo implements Transferable<Jugador_torneo.Transfer> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
	private long id;

    @ManyToOne
    @JoinColumn(name = "id_torneo", nullable = false)
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private User usuario;

    @Column(nullable = false)
    private int puntuacion;

    @Getter
    @AllArgsConstructor
    public static class Transfer {
		private long id;
        private long id_torneo;
        private long id_usuario;
        private int puntuacion; 
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(id, torneo.getId(), usuario.getId(), puntuacion);
    }

    @Override
	public String toString() {
		return toTransfer().toString();
	}

}