package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Jugador_partida;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.User;
import jakarta.persistence.EntityManager;
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
    
        model.addAttribute("partidas", 
        entityManager.createQuery("select p from Partida p").getResultList());
        return "lobby";
    }

    @PostMapping("/partida/{id}")
    public String verPartida(@PathVariable long id, Model model) {
        log.info("Solicitud POST recibida para la partida con ID: " + id);

        // Buscar la partida en la base de datos
        Partida partida = entityManager.find(Partida.class, id);
        if (partida == null) {
            throw new IllegalArgumentException("Partida no encontrada con ID: " + id);
        }

        // Buscar los usuarios asociados a la partida
        List<User> usuarios = entityManager.createQuery(
                "SELECT u FROM User u JOIN Jugador_partida jp ON u.id = jp.usuario.id WHERE jp.partida.id = :id", User.class)
                .setParameter("id", id)
                .getResultList();
        log.info("Usuarios encontrados para la partida {}: {}", id, usuarios.size());

        // Pasar la partida y los usuarios al modelo
        model.addAttribute("partida", partida);
        model.addAttribute("usuarios", usuarios);

        return "game"; // Redirigir a la vista de la partida
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
