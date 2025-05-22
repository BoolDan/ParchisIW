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
    public String mostrarPartidas(Model model) {
        // Obtener todas las partidas
        List<Partida> partidas = entityManager.createQuery("SELECT p FROM Partida p", Partida.class).getResultList();
        // Crear un mapa para almacenar las listas de jugadores por partida
        Map<Long, List<String>> jugadoresPorPartida = new HashMap<>();
        for (Partida partida : partidas) {
            // Obtener los nombres de los jugadores asociados a la partida
            List<String> jugadores = entityManager.createQuery(
                    "SELECT u.username FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", String.class)
                    .setParameter("id", partida.getId())
                    .getResultList();
            jugadoresPorPartida.put(partida.getId(), jugadores);
        }

        // Añadir las partidas y los jugadores al modelo
        model.addAttribute("partidas", partidas);
        model.addAttribute("jugadoresPorPartida", jugadoresPorPartida);
        return "lobby";

    }

    @RequestMapping(value = "/lobby/{id}", method = {RequestMethod.GET, RequestMethod.POST})
    @Transactional
    public String manejarLobby(@PathVariable long id, HttpSession session, Model model) {
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
            // Solo lo añadimos si no está
            if (partida.getNumJugadores() >= partida.getJugadoresMax()) {
                return "redirect:/lobby";
            }
    
            Jugador_partida jugadorPartida = new Jugador_partida();
            jugadorPartida.setUsuario(usuarioActual);
            jugadorPartida.setPartida(partida);
            entityManager.persist(jugadorPartida);
    
            partida.setNumJugadores(partida.getNumJugadores() + 1);
            entityManager.merge(partida);

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

        return "lobbyPartida";
    }

    @PostMapping("/lobby/{id}/toggleListo")
    @Transactional
    @ResponseBody
    public void toggleListo(@PathVariable long id, @RequestBody Map<String, Object> payload) {
        String jugador = (String) payload.get("jugador");
        boolean listo = (boolean) payload.get("listo");
    
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


        // Si me quiero unir a la partida (POST)
        if ("POST".equalsIgnoreCase(request.getMethod())) {
            User usuarioActual = (User) session.getAttribute("u");
            if (usuarioActual == null) {
                throw new IllegalStateException("No se encontró un usuario en la sesión.");
            }

             // Comprobar si ya está
            boolean yaEnPartida = entityManager.createQuery(
                "SELECT COUNT(jp) FROM Jugador_partida jp WHERE jp.partida.id = :pid AND jp.usuario.id = :uid", Long.class)
                .setParameter("pid", id)
                .setParameter("uid", usuarioActual.getId())
                .getSingleResult() > 0;

            if (!yaEnPartida) {
                // Solo lo añadimos si no está
                if (partida.getNumJugadores() >= partida.getJugadoresMax()) {
                    model.addAttribute("error", "La partida ya está llena.");
                    return "redirect:/lobby";
                }

                Jugador_partida jugadorPartida = new Jugador_partida();
                jugadorPartida.setUsuario(usuarioActual);
                jugadorPartida.setPartida(partida);
                // Asignar un color de jugador
                // Colores disponibles
                List<Jugador_partida.Color_Jugador> coloresDisponibles = new ArrayList<>(
                List.of(Jugador_partida.Color_Jugador.values()));

                // Colores ya usados
                List<Jugador_partida.Color_Jugador> coloresUsados = entityManager.createQuery(
                    "SELECT jp.colorJugador FROM Jugador_partida jp WHERE jp.partida.id = :id", Jugador_partida.Color_Jugador.class)
                    .setParameter("id", partida.getId())
                    .getResultList();

                coloresDisponibles.removeAll(coloresUsados);

                // Asignar el primero disponible
                if (!coloresDisponibles.isEmpty()) {
                    jugadorPartida.setColorJugador(coloresDisponibles.get(0));
                } else {
                    // Fallback si todos están usados (no debería pasar)
                    jugadorPartida.setColorJugador(Jugador_partida.Color_Jugador.ROJO);
                }

                entityManager.persist(jugadorPartida);
                // Notificar a todos los jugadores por WebSocket
                messagingTemplate.convertAndSend("/topic/game/" + partida.getId(), Map.of(
                    "tipo", "nuevoJugador"
                ));

                partida.setNumJugadores(partida.getNumJugadores() + 1);
                topicPartida.getMembers().add(usuarioActual);
                entityManager.merge(topicPartida);

                entityManager.merge(partida);
            }
            
        }
        
        //Recalcular la lista de usuarios y jugadores después del POST
        List<User> usuarios = entityManager.createQuery(
                "SELECT u FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", User.class)
                .setParameter("id", id)
                .getResultList();

        // Asignar colores a los jugadores
        List<String> colores = List.of("rojo", "verde", "azul", "amarillo", "morado", "cian");
        List<Map<String, String>> jugadores = IntStream.range(0, usuarios.size())
                .mapToObj(i -> {
                    String nombre = usuarios.get(i).getUsername();
                    String color = colores.get(i % colores.size());
                    return Map.of("nombre", nombre, "color", color);
                })
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

        // Redirigir al lobby de la nueva partida
        return "redirect:/lobby/" + nuevaPartida.getId();
    }

}