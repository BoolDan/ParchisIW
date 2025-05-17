package es.ucm.fdi.iw.controller;

import java.util.Map;

import es.ucm.fdi.iw.model.Jugador_partida;
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

    @PostMapping("/sendMessage/{gameId}")
    @Transactional
    @ResponseBody
    public Object sendMessage(@RequestBody Message.Transfer messageTransfer, HttpSession session) {
        log.info("Mensaje recibido en el servidor: " + messageTransfer); // Verifica el mensaje recibido
    
        User sender = entityManager.find(User.class, 
            ((User)session.getAttribute("u")).getId());
        
        Partida partida = entityManager.find(Partida.class, Long.parseLong(messageTransfer.getGameId()));
        if (partida == null) {
            System.err.println("Partida no encontrada: " + messageTransfer.getGameId()); // Log de error si la partida no existe
            return Map.of("result", "BAD gameID");
        }
    
        // Crear y guardar el mensaje en la base de datos
        Message message = new Message();
        message.setEmisor(sender);
        message.setPartida(partida);
        message.setText(messageTransfer.getText());
        message.setDateSent(LocalDateTime.now());
        entityManager.persist(message);
        entityManager.flush();
    
        log.info("Mensaje guardado en la base de datos: " + message); // Verifica si el mensaje se guarda correctamente
    
        // Enviar mensaje al canal público de la partida
        messagingTemplate.convertAndSend("/topic/game/" + partida.getId(), new Message.Transfer(message));
        log.info("Mensaje enviado al canal: /topic/game/" + partida.getId()); // Verifica si el mensaje se envía al canal
        return Map.of("result", "OK");
    }

    
    /**
     * @param estado
     * @param gameId
     * @param session
     * @return
     */
    @PostMapping("/sendState/{gameId}")
    @Transactional
    @ResponseBody
    public Object sendState(@RequestBody String estado, @PathVariable long gameId, HttpSession session) {
        log.info("Estado recibido en el servidor: " + estado);
    
        User sender = entityManager.find(User.class, 
            ((User)session.getAttribute("u")).getId());


        // FIXME: comprobar que el jugador está jugando en la partida
        Jugador_partida jugadorPartida = entityManager.createQuery(
            "SELECT jp FROM Jugador_partida jp WHERE jp.usuario.id = :userId AND jp.partida.id = :gameId", Jugador_partida.class)
            .setParameter("userId", sender.getId())
            .setParameter("gameId", gameId)
            .getSingleResult();
            
        if (jugadorPartida == null) {
            log.info("El jugador no está en la partida: " + gameId); // Log de error si el jugador no está en la partida
            return Map.of("result", "BAD gameID");
        }

        Partida partida = entityManager.find(Partida.class, gameId);
        partida.setInformacionPartida(estado);
        log.info("Estado guardado en la base de datos: " + estado); // Verifica si el mensaje se guarda correctamente
    
        // Enviar mensaje al canal público de la partida
        messagingTemplate.convertAndSend("/topic/game/" + partida.getId(), estado);
        log.info("Mensaje enviado al canal: /topic/game/" + partida.getId()); // Verifica si el mensaje se envía al canal
        return Map.of("result", "OK");
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
    @PostMapping("/topic/game/{gameId}")
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

       
}
