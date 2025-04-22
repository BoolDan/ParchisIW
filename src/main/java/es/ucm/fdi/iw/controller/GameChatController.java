package es.ucm.fdi.iw.controller;

import java.util.Map;

import es.ucm.fdi.iw.model.Message;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.User.Role;
import es.ucm.fdi.iw.model.Topic;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class GameChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final Logger log = LogManager.getLogger(ApiController.class);

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



    /*
     * Cosas copiadas y pegadas de la plantilla sobre los topics
     * 
     * Esto estaba en ApiController.java, de momento lo pego aquí si queremos tener un controlador para los mensajes
     */


    /**
     * Posts a message to a topic.
     * 
     * @param topic of target user (source user is from ID)
     * @param o  JSON-ized message, similar to {"message": "text goes here"}
     * @throws JsonProcessingException
     */
    @PostMapping("/topic/{name}")
    @ResponseBody
    @Transactional
    public Map<String,String> postMsg(@PathVariable String name,
        @RequestBody JsonNode o, Model model, HttpSession session,
        HttpServletResponse response)
        throws JsonProcessingException {

        String text = o.get("message").asText();
        User sender = entityManager.find(
            User.class, ((User) session.getAttribute("u")).getId());
        Topic target = entityManager.createNamedQuery("Topic.byKey", Topic.class)
            .setParameter("key", name).getSingleResult();  

        // verify permissions
        if (! sender.hasRole(Role.ADMIN) && ! target.getMembers().contains(sender)) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        return Map.of("error", "user not in group");
        }

        // build message, save to BD
        Message m = new Message();
        m.setRecipient(null);
        m.setEmisor(sender);
        m.setTopic(target);
        m.setDateSent(LocalDateTime.now());
        m.setText(text);
        entityManager.persist(m);
        entityManager.flush(); // to get Id before commit

        // send to topic & return
        String json = new ObjectMapper().writeValueAsString(m.toTransfer());
        log.info("Sending a message to  group {} with contents '{}'", target.getName(), json);
        messagingTemplate.convertAndSend("/topic/" + name, json);
        return Map.of("result", "message sent");
    }

        /**
     * Posts a message to a topic.
     * 
     * @param topic of target user (source user is from ID)
     * @param o  JSON-ized message, similar to {"message": "text goes here"}
     * @throws JsonProcessingException
     */
    @GetMapping("/topic/{name}")
    @ResponseBody
    @Transactional
    public Map<String,String> getMessages(@PathVariable String name, HttpSession session,
            HttpServletResponse response)
        throws JsonProcessingException {

        User requester = entityManager.find(
            User.class, ((User) session.getAttribute("u")).getId());
        Topic target = entityManager.createNamedQuery("Topic.byKey", Topic.class)
            .setParameter("key", name).getSingleResult();  
    
        // verify permissions
        if (! requester.hasRole(Role.ADMIN) && ! target.getMembers().contains(requester)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return Map.of("error", "user not in group");
        } 
        // return result
        return Map.of("messages", new ObjectMapper().writeValueAsString(
            target.getMessages().stream()
            .map(Message::toTransfer).toArray()
        ));
    }
    

}
