package es.ucm.fdi.iw.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestParam;

import es.ucm.fdi.iw.model.Partida;


/**
 *  Non-authenticated requests only.
 */
@Controller
public class RootController {

    private static final Logger log = LogManager.getLogger(RootController.class);

    @Autowired
    private EntityManager entityManager;


    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {        
        for (String name : new String[] {"u", "url", "ws", "topics"}) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }

	@GetMapping("/login")
    public String login(Model model, HttpServletRequest request) {
        boolean error = request.getQueryString() != null && request.getQueryString().indexOf("error") != -1;
        model.addAttribute("loginError", error);
        return "login";
    }

    @GetMapping("/game")
    public String game(Model model) {
        Partida partida = null;
         // Buscar una partida en estado "ESPERANDO_JUGADORES"
        List<Partida> partidasEnEspera = entityManager.createQuery(
                "SELECT p FROM Partida p WHERE p.estado = :estado", Partida.class)
                .setParameter("estado", Partida.EstadoPartida.ESPERANDO_JUGADORES)
                .getResultList();

        if (!partidasEnEspera.isEmpty()) {
            // Seleccionar una partida al azar
            partida = partidasEnEspera.get((int) (Math.random() * partidasEnEspera.size()));
            model.addAttribute("partida", partida);
            return "redirect:/partida/" + partida.getId(); // Redirigir a la partida
        }

        // Si no hay partidas en espera, mostrar el lobby con un mensaje
        model.addAttribute("mensaje", "No hay partidas disponibles en este momento.");    

        return "game";
    }
    
    @GetMapping("/configuracion")
    public String configuracion(Model model) {
        return "configuracion";
    }

	@GetMapping("/")
    public String index(Model model) {
        return "index";
    }

    @GetMapping("/reglas")
    public String reglas(Model model) {
        return "reglas";
    }
    
}
