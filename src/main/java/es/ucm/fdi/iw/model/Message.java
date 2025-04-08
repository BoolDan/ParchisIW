package es.ucm.fdi.iw.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.AllArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Entity
@Data
@NamedQueries({
    @NamedQuery(name="Message.findById",
    query="SELECT m FROM Message m WHERE m.id = :id")
})
@Table(name="Mensaje")
public class Message implements Transferable<Message.Transfer> {

    private static Logger log = LogManager.getLogger(Message.class);

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen")
    @SequenceGenerator(name = "gen", sequenceName = "gen")
    private long id;

    @ManyToOne
    @JoinColumn(name="id_usuario") 
    private User emisor;

    @ManyToOne
    @JoinColumn(name="id_partida")
    private Partida partida;

    @Column(nullable = false, length = 512)
    private String text;

    @Column(nullable = false)
    private LocalDateTime dateSent;
    
    private LocalDateTime dateRead;
    
    @Column
    private LocalDateTime fechaReporte;
    
    @Column(nullable = false)
    private boolean reported;

    /**
     * Constructor para persistir a/de JSON
     * @author mfreire
     */
    @Getter
    @AllArgsConstructor
    public static class Transfer {
        private String from;
        private String sent;
        private String received;
        private String text;
        private long id;
        private String gameId;

        public Transfer(Message m) {
            this.from = m.getEmisor().getUsername();
            this.sent = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(m.getDateSent());
            this.received = m.getDateRead() == null ? null : DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(m.getDateRead());
            this.text = m.getText();
            this.id = m.getId();
            this.gameId = String.valueOf(m.getPartida().getId());
        }
    }

    @Override
    public Transfer toTransfer() {
        return new Transfer(emisor.getUsername(), 
            DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dateSent),
            dateRead == null ? null : DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(dateRead),
            text, id, String.valueOf(partida.getId())
        );
    }

    public void report() {
        this.reported = true;
        this.fechaReporte = LocalDateTime.now();
    }
}
