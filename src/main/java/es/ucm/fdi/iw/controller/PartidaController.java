package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Jugador_partida;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.Topic;
import es.ucm.fdi.iw.model.User;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import jakarta.persistence.NoResultException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;

@Controller

public class PartidaController {
    private static final Logger log = LogManager.getLogger(AdminController.class);
    @Autowired
    private EntityManager entityManager;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] {"u", "url", "ws", "topics"}) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

   @GetMapping("/lobby")
    public String mostrarPartidas(Model model, HttpSession session) {
        // Obtener todas las partidas
        List<Partida> partidas = entityManager.createQuery("SELECT p FROM Partida p", Partida.class).getResultList();
        // Crear un mapa para almacenar las listas de jugadores por partida
        Map<Long, List<String>> jugadoresPorPartida = new HashMap<>();
        Map<Long, Boolean> jugadorenPartida = new HashMap<>();
        for (Partida partida : partidas) {
            // Obtener los nombres de los jugadores asociados a la partida
            List<String> jugadores = entityManager.createQuery(
                    "SELECT u.username FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", String.class)
                    .setParameter("id", partida.getId())
                    .getResultList();
            jugadoresPorPartida.put(partida.getId(), jugadores);
            Boolean isinPartida = false;
            User usuarioActual = (User) session.getAttribute("u");
            for (String jugador: jugadores) {
                if (jugador == usuarioActual.getUsername()) {
                    isinPartida = true;
                }
            }
            jugadorenPartida.put(partida.getId(), isinPartida);
        }
        // Añadir las partidas y los jugadores al modelo
        model.addAttribute("partidas", partidas);
        model.addAttribute("jugadoresPorPartida", jugadoresPorPartida);
        model.addAttribute("jugadorenPartida", jugadorenPartida);
        return "lobby";
    }

    @RequestMapping(value = "/lobby/{id}", method = RequestMethod.GET)
    @Transactional
    public String mostrarLobby(@PathVariable long id, HttpSession session, Model model) {
        // Obtener la partida por su ID
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }
    
        // Obtener el usuario de la sesión
        User usuarioActual = (User) session.getAttribute("u");
        if (usuarioActual == null) {
            throw new IllegalStateException("No se encontró un usuario en la sesión.");
        }
    
        boolean esMiembro = entityManager.createQuery(
                "SELECT COUNT(jp) FROM Jugador_partida jp WHERE jp.partida.id = :pid AND jp.usuario.id = :uid", Long.class)
                .setParameter("pid", id)
                .setParameter("uid", usuarioActual.getId())
                .getSingleResult() > 0;
        if (!esMiembro) {
            // No es miembro, redirige al lobby general
            return "redirect:/lobby";
        }
        boolean todosListos = entityManager.createQuery(
                "SELECT COUNT(jp) FROM Jugador_partida jp WHERE jp.partida.id = :id AND jp.listo = false", Long.class)
                .setParameter("id", id)
                .getSingleResult() == 0;
        if (todosListos){
            return "redirect:/partida/" + partida.getId();
        }
        // Obtener la lista de jugadores para mostrar en el lobby
        List<Map<String, Object>> jugadores = entityManager.createQuery(
            "SELECT u.username as nombre, jp.listo as listo FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", Object[].class)
            .setParameter("id", id)
            .getResultList()
            .stream()
            .map(row -> Map.of(
                    "nombre", row[0],
                    "listo", row[1]
            ))
            .collect(Collectors.toList());

        // Notificar a todos los jugadores por WebSocket
        messagingTemplate.convertAndSend("/topic/lobby/" + partida.getId(), Map.of(
                "tipo", "nuevoJugador",
                "jugadores", jugadores
        ));
    
        model.addAttribute("partida", partida);
        model.addAttribute("jugadoresEnPartida", jugadores);
        model.addAttribute("jugadorActual", usuarioActual.getUsername());

        return "lobbyPartida";
    }

    @PostMapping("/lobby/{id}/unirse")
    @Transactional
    public String unirseLobby(@PathVariable long id, HttpSession session) {
        // Obtener la partida por su ID
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }
    
        // Obtener el usuario de la sesión
        User usuarioActual = (User) session.getAttribute("u");
        if (usuarioActual == null) {
            throw new IllegalStateException("No se encontró un usuario en la sesión.");
        }
    
        // Comprobar si el usuario ya está en el lobby
        boolean yaEnLobby = entityManager.createQuery(
                "SELECT COUNT(jp) FROM Jugador_partida jp WHERE jp.partida.id = :pid AND jp.usuario.id = :uid", Long.class)
                .setParameter("pid", id)
                .setParameter("uid", usuarioActual.getId())
                .getSingleResult() > 0;
    
        if (!yaEnLobby) {
            Jugador_partida jugadorPartida = new Jugador_partida();
            jugadorPartida.setUsuario(usuarioActual);
            jugadorPartida.setPartida(partida);
            entityManager.persist(jugadorPartida);
    
            partida.setNumJugadores(partida.getNumJugadores() + 1);
            entityManager.merge(partida);
        } 
        return "redirect:/lobby/" + id;
    }

    @PostMapping("/lobby/{id}/toggleListo")
    @Transactional
    @ResponseBody
    public void toggleListo(@PathVariable long id, @RequestBody Map<String, Object> payload, HttpSession session) {
        String jugador = (String) payload.get("jugador");
        boolean listo = (boolean) payload.get("listo");

        User usuarioSesion = (User) session.getAttribute("u");
        if (usuarioSesion == null) {
            throw new IllegalStateException("No se encontró un usuario en la sesión.");
        }
        if (!usuarioSesion.getUsername().equals(jugador)) {
            throw new SecurityException("No tienes permiso para cambiar el estado de otro jugador.");
        }
    
        // Actualizar el estado del jugador en la base de datos
        Jugador_partida jugadorPartida = entityManager.createQuery(
                "SELECT jp FROM Jugador_partida jp WHERE jp.partida.id = :pid AND jp.usuario.username = :username", Jugador_partida.class)
                .setParameter("pid", id)
                .setParameter("username", jugador)
                .getSingleResult();
    
        jugadorPartida.setListo(listo);
        entityManager.merge(jugadorPartida);
    
        // Notificar a todos los jugadores en el lobby
        List<Map<String, Object>> jugadores = entityManager.createQuery(
        "SELECT u.username as nombre, jp.listo as listo FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", Object[].class)
                .setParameter("id", id)
                .getResultList()
                .stream()
                .map(row -> Map.of(
                        "nombre", row[0],
                        "listo", row[1]
                ))
                .collect(Collectors.toList());
    
        messagingTemplate.convertAndSend("/topic/lobby/" + id, Map.of(
                "tipo", "actualizarListos",
                "jugadores", jugadores
        ));
    }

    @PostMapping("/lobby/{id}/comenzarPartida")
    @Transactional
    @ResponseBody
    public void comenzarPartida(@PathVariable long id) {
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }
    
        boolean todosListos = entityManager.createQuery(
                "SELECT COUNT(jp) FROM Jugador_partida jp WHERE jp.partida.id = :id AND jp.listo = false", Long.class)
                .setParameter("id", id)
                .getSingleResult() == 0;
    
        if (todosListos) {

            // Asignar colores a los jugadores que no tengan color
            List<Jugador_partida> jugadoresPartida = entityManager.createQuery(
                "SELECT jp FROM Jugador_partida jp WHERE jp.partida.id = :id", Jugador_partida.class)
                .setParameter("id", id)
                .getResultList();

            List<Jugador_partida.Color_Jugador> coloresDisponibles = new ArrayList<>(List.of(Jugador_partida.Color_Jugador.values()));
            // Elimina los colores ya usados (por si acaso)
            jugadoresPartida.stream()
                .map(Jugador_partida::getColorJugador)
                .filter(c -> c != null)
                .forEach(coloresDisponibles::remove);

            for (Jugador_partida jp : jugadoresPartida) {
                if (jp.getColorJugador() == null && !coloresDisponibles.isEmpty()) {
                    jp.setColorJugador(coloresDisponibles.remove(0));
                    entityManager.merge(jp);
                }
            }

            partida.setEstado(Partida.EstadoPartida.EN_CURSO);
            entityManager.merge(partida);

            messagingTemplate.convertAndSend("/topic/lobby/" + id, Map.of(
                    "tipo", "partidaIniciada"
            ));
        }
    }

    @RequestMapping(value = "/partida/{id}", method = {RequestMethod.GET, RequestMethod.POST})
    @Transactional
    public String manejarPartida(@PathVariable long id, Model model, HttpServletRequest request, HttpSession session) {

        log.info("Solicitud {} recibida para la partida con ID: {}", request.getMethod(), id);
        // Buscar la partida en la base de datos
        
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }

        User usuarioActual = (User) session.getAttribute("u");
        if (usuarioActual == null) {
            throw new IllegalStateException("No se encontró un usuario en la sesión.");
        }

        // Comprobar si el usuario está en la partida
        boolean esMiembro = entityManager.createQuery(
                "SELECT COUNT(jp) FROM Jugador_partida jp WHERE jp.partida.id = :pid AND jp.usuario.id = :uid", Long.class)
                .setParameter("pid", id)
                .setParameter("uid", usuarioActual.getId())
                .getSingleResult() > 0;
        
        if (!esMiembro) {
            // No es miembro, redirige al lobby general
            return "redirect:/lobby";
        }

        // Comprobar si la partida está en curso
        if (partida.getEstado() != Partida.EstadoPartida.EN_CURSO) {
            // Aunque sea miembro, si la partida no ha comenzado, redirige al lobby de la partida
            return "redirect:/lobby/" + id;
        }

        // Obtener/crear el Topic
        Topic topicPartida;
        try {
            topicPartida = entityManager.createQuery("SELECT t FROM Topic t WHERE t.name = :name", Topic.class)
                .setParameter("name", "Partida" + partida.getId())
                .getSingleResult();
        } catch (NoResultException e) {
            topicPartida = new Topic();
            topicPartida.setName("Partida" + partida.getId());
            topicPartida.setKey(UserController.generateRandomBase64Token(6));
            entityManager.persist(topicPartida);
        }

        // Obtener los usuarios y sus colores desde Jugador_partida
        List<Jugador_partida> jugadoresPartida = entityManager.createQuery(
            "SELECT jp FROM Jugador_partida jp WHERE jp.partida.id = :id", Jugador_partida.class)
            .setParameter("id", id)
            .getResultList();

        List<Map<String, String>> jugadores = jugadoresPartida.stream()
            .filter(jp -> jp.getColorJugador() != null)
            .map(jp -> Map.of(
                "nombre", jp.getUsuario().getUsername(),
                "color", jp.getColorJugador().name().toLowerCase()
            ))
            .collect(Collectors.toList());

        // Añadir todo al modelo
        model.addAttribute("jugadores", jugadores);
        model.addAttribute("topic", topicPartida);
        model.addAttribute("partida", partida);
        // model.addAttribute("usuarios", usuarios);

        return "game";
    }

    @GetMapping("/partida/{id}/jugadores")
    @ResponseBody
    public List<Map<String, String>> obtenerJugadores(@PathVariable long id) {
        List<Jugador_partida> jugadoresPartida = entityManager.createQuery(
            "SELECT jp FROM Jugador_partida jp WHERE jp.partida.id = :id", Jugador_partida.class)
            .setParameter("id", id)
            .getResultList();

        return jugadoresPartida.stream()
            .map(jp -> Map.of(
                "nombre", jp.getUsuario().getUsername(),
                "color", jp.getColorJugador().name().toLowerCase()
            ))
            .collect(Collectors.toList());
    }

    @PostMapping("/partida/crear")
    @Transactional
    public String crearPartida(@RequestParam("numJugadores") int jugadoresMax,@RequestParam("modoJuego") String modoJuego,@RequestParam("tipoPartida") String tipoPartida,Model model) {
        // Crear una nueva instancia de Partida
        Partida nuevaPartida = new Partida();
        nuevaPartida.setJugadoresMax(jugadoresMax);
        nuevaPartida.setModoJuego(modoJuego);
        nuevaPartida.setTipoPartida(tipoPartida);
        nuevaPartida.setNumJugadores(0); // Inicialmente no hay jugadores
        nuevaPartida.setEstado(Partida.EstadoPartida.ESPERANDO_JUGADORES); // Estado inicial de la partida

        // Persistir la partida en la base de datos
        entityManager.persist(nuevaPartida);

        Topic topicPartida = new Topic();
        topicPartida.setName("Partida" + nuevaPartida.getId());
        topicPartida.setKey(UserController.generateRandomBase64Token(6));
        entityManager.persist(topicPartida);

        // Añadir automaticamente al creador de la partida
        User usuarioActual = (User) model.getAttribute("u");
        if (usuarioActual != null) {
            Jugador_partida jugadorPartida = new Jugador_partida();
            jugadorPartida.setUsuario(usuarioActual);
            jugadorPartida.setPartida(nuevaPartida);
            entityManager.persist(jugadorPartida);
            nuevaPartida.setNumJugadores(nuevaPartida.getNumJugadores() + 1);
            entityManager.merge(nuevaPartida);
        }

        // Redirigir al lobby de la nueva partida
        return "redirect:/lobby/" + nuevaPartida.getId();
    }

}