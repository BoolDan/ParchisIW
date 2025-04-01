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

import org.antlr.v4.runtime.misc.NotNull;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalTime;


@Entity
@Data  // @Getter, @Setter, @ToString, @Equals and Hash Code, @RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({

})

@Table(name="Partida")
public class Partida implements Transferable<Partida.Transfer> {
    
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
    private String colorTurno;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING) //store the string value of the enum
    private EstadoPartida estado = EstadoPartida.ESPERANDO_JUGADORES;

    @Column
    private int numJugadores;

    @Column
    private int jugadoresMax;

    @Column
    private String resultadoFinal;

    @Column
    private String movimientos_turno;

    @Column 
    private String tipoPartida;

    @Column 
    private String modoJuego;

    @Column
    private String posicionesFichas; //JSON con las posiciones de las fichas en el tablero

    @Column(columnDefinition = "TEXT") // Para permitir JSON largos
    private String informacionPartida; // JSON con información adicional de la partida

    // Métodos para manejar el JSON
    public Map<String, Object> getInformacionPartida() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(this.informacionPartida, Map.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void setInformacionPartida(Map<String, Object> info) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            this.informacionPartida = objectMapper.writeValueAsString(info);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /*@Column
    private String chat_token;*/

    public void setMovimientos(List<String> movimientos) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            this.movimientos_turno = objectMapper.writeValueAsString(movimientos);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ManyToOne
    @JoinColumn(name = "id_torneo")
    private Torneo torneo;

    @Getter
    @AllArgsConstructor
    public static class Transfer {
		private long id;
        private String colorTurno;
		private String estado;
        private int numJugadores;
        private int jugadoresMax;
        private String resultadoFinal;
        private String movimientos_turno;
        private Torneo torneo;
    }

    @Override
    public Transfer toTransfer() {
		return new Transfer(id, colorTurno, estado.toString(), numJugadores, jugadoresMax, resultadoFinal, movimientos_turno, torneo);
	}

    @Override
	public String toString() {
		return toTransfer().toString();
	}
    /*@OneToMany 
    @JoinColumn(name = "chat")
    private List<Message> chat;*/
}
