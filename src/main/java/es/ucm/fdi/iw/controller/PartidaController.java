package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Partida;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

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
        for (String name : new String[] {"u", "url", "ws"}) {
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
        // Partida p = entityManager.find(Partida.class, id);
        //model.addAttribute("partida", p);
        return "game";
    }
}
