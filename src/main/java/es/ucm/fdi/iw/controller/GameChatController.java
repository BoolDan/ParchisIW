package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Message;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.User;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class GameChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final EntityManager entityManager;

    public GameChatController(SimpMessagingTemplate messagingTemplate, EntityManager entityManager) {
        this.messagingTemplate = messagingTemplate;
        this.entityManager = entityManager;
    }

    @MessageMapping("/chat.sendMessage/{gameId}")
    @Transactional
    public void sendMessage(Message.Transfer messageTransfer, Principal principal) {
        System.out.println("Mensaje recibido en el servidor: " + messageTransfer); // Verifica el mensaje recibido
    
        User sender = entityManager.find(User.class, principal.getName());
        if (sender == null) {
            System.err.println("Usuario no encontrado: " + principal.getName()); // Log de error si el usuario no existe
            return;
        }
    
        Partida partida = entityManager.find(Partida.class, Long.parseLong(messageTransfer.getGameId()));
        if (partida == null) {
            System.err.println("Partida no encontrada: " + messageTransfer.getGameId()); // Log de error si la partida no existe
            return;
        }
    
        // Crear y guardar el mensaje en la base de datos
        Message message = new Message();
        message.setEmisor(sender);
        message.setPartida(partida);
        message.setText(messageTransfer.getText());
        message.setDateSent(LocalDateTime.now());
    
        entityManager.persist(message);
        entityManager.flush();
    
        System.out.println("Mensaje guardado en la base de datos: " + message); // Verifica si el mensaje se guarda correctamente
    
        // Enviar mensaje al canal público de la partida
        messagingTemplate.convertAndSend("/topic/game/" + partida.getId(), new Message.Transfer(message));
        System.out.println("Mensaje enviado al canal: /topic/game/" + partida.getId()); // Verifica si el mensaje se envía al canal
    }
}
