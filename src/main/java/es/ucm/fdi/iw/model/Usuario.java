package es.ucm.fdi.iw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * An authorized user of the system.
 */
@Entity
@Data
@NoArgsConstructor
@NamedQueries({
        @NamedQuery(name="Usuario.byUsername",
                query="SELECT u FROM User u "
                        + "WHERE u.username = :username AND u.enabled = TRUE"),
        @NamedQuery(name="User.hasUsername",
                query="SELECT COUNT(u) "
                        + "FROM User u "
                        + "WHERE u.username = :username")
})
@Table(name="Usuario")
public class Usuario implements Transferable<Usuario.Transfer> {

    public enum Rol {
        USER,			// normal users 
        ADMIN,          // admin users
    }
    public enum Estado {
        BANEADO,			// Usuario 
        NORMAL,          // admin users
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
	private long id;

    @Column(nullable = false, unique = true)
    private String nombre_usuario;
    @Column(nullable = false)
    private String contraseña;
    @Column
    private Estado baneado;
    @Column
    private String correo;
    @Column
    private String pais;

    private boolean enabled;
    private String rol; // split by ',' to separate roles

	@OneToMany
	@JoinColumn(name = "sender_id")
	private List<Message> sent = new ArrayList<>();
	@OneToMany
	@JoinColumn(name = "recipient_id")	
	private List<Message> received = new ArrayList<>();		

    /**
     * Checks whether this user has a given role.
     * @param role to check
     * @return true iff this user has that role.
     */
    public boolean hasRole(Rol role) {
        String roleName = role.name();
        return Arrays.asList(rol.split(",")).contains(roleName);
    }

    public boolean isbanned() {
        return this.baneado == Estado.BANEADO;
    }

    @Getter
    @AllArgsConstructor
    public static class Transfer {
		private long id;
        private String username;
		private int totalReceived;
		private int totalSent;
    }

	@Override
    public Transfer toTransfer() {
		return new Transfer(id,	nombre_usuario, received.size(), sent.size());
	}
	
	@Override
	public String toString() {
		return toTransfer().toString();
	}
}

