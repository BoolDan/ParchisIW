package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Jugador_partida;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.Topic;
import es.ucm.fdi.iw.model.User;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] {"u", "url", "ws", "topics"}) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }


   @GetMapping("/lobby")
    public String listarPartidas(Model model) {
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

    @RequestMapping(value = "/partida/{id}", method = {RequestMethod.GET, RequestMethod.POST})
    @Transactional
    public String manejarPartida(@PathVariable long id, Model model, HttpServletRequest request, HttpSession session) {
        log.info("Solicitud {} recibida para la partida con ID: {}", request.getMethod(), id);
    
        // Buscar la partida en la base de datos
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }
    
        // Lógica para mostrar la información de la partida (GET)
        List<User> usuarios = entityManager.createQuery(
                "SELECT u FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", User.class)
                .setParameter("id", id)
                .getResultList();
    
        // Si me quiero unir a la partida (POST)
        if ("POST".equalsIgnoreCase(request.getMethod())) {
            // Validar si la partida tiene espacio para más jugadores
            if (partida.getNumJugadores() >= partida.getJugadoresMax()) {
                log.warn("La partida con ID {} ya está llena.", id);
                model.addAttribute("error", "La partida ya está llena.");
                return "redirect:/lobby"; // Redirigir al lobby con un mensaje de error
            }
    
            // Obtener el usuario actual desde la sesión
            User usuarioActual = (User) session.getAttribute("u");
            if (usuarioActual == null) {
                throw new IllegalStateException("No se encontró un usuario en la sesión.");
            }
    
            // Verificar si el usuario ya está en la partida
            boolean yaEnPartida = usuarios.stream().anyMatch(u -> u.getId() == usuarioActual.getId());
            if (yaEnPartida) {
                log.warn("El usuario con ID {} ya está en la partida con ID {}.", usuarioActual.getId(), id);
                return "redirect:/partida/" + id; // Redirigir a la vista de la partida
            }
    
            // Añadir el usuario a la partida (a través de Jugador_partida)
            Jugador_partida jugadorPartida = new Jugador_partida();
            jugadorPartida.setUsuario(usuarioActual);
            jugadorPartida.setPartida(partida);
            entityManager.persist(jugadorPartida);
    
            // Incrementar el número de jugadores
            partida.setNumJugadores(partida.getNumJugadores() + 1);

                // Si la partida alcanza el máximo de jugadores, actualizar su estado
            if (partida.getNumJugadores() >= partida.getJugadoresMax()) {
                partida.setEstado(Partida.EstadoPartida.EN_CURSO); // Cambiar el estado a EN_CURSO
                log.info("La partida con ID {} ha alcanzado el máximo de jugadores y ahora está EN_CURSO.", id);
            }
            
            entityManager.merge(partida);
    
            log.info("El usuario con ID {} se ha unido a la partida con ID: {}", usuarioActual.getId(), id);
    
            // Redirigir a la vista de la partida
            return "redirect:/partida/" + id;
        }
    
        // Pasar la partida y los usuarios al modelo
        model.addAttribute("partida", partida);
        model.addAttribute("usuarios", usuarios);
    
        return "game"; // Renderizar la vista de la partida
    }

    @PostMapping("/partida/crear")
    @Transactional
    public String crearPartida(
            @RequestParam("numJugadores") int jugadoresMax,
            @RequestParam("modoJuego") String modoJuego,
            @RequestParam("tipoPartida") String tipoPartida,
            Model model) {

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
        topicPartida.setName("Partida " + nuevaPartida.getId());
        topicPartida.setKey(UserController.generateRandomBase64Token(6));
        entityManager.persist(topicPartida);

        // Redirigir al lobby o a la vista de la partida creada
        return "redirect:/lobby";
    }

    @PostMapping("/partida/{id}/actualizar")
    @ResponseBody
    @Transactional
    public Map<String, Object> actualizarPartida(@PathVariable long id, @RequestBody Map<String, Object> datos) {
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }

        // Obtener la información actual de la partida
        Map<String, Object> info = partida.getInformacionPartida();
        if (info == null) {
            info = new HashMap<>();
        }

        // Actualizar los datos recibidos
        info.putAll(datos);
        partida.setInformacionPartida(info);

        // Guardar los cambios
        entityManager.merge(partida);

        // Devolver la información actualizada
        return info;
    }
}
