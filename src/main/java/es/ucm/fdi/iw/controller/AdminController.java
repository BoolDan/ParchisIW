package es.ucm.fdi.iw.controller;

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

import es.ucm.fdi.iw.model.Lorem;
import es.ucm.fdi.iw.model.Torneo;
import es.ucm.fdi.iw.model.Partida;
import es.ucm.fdi.iw.model.User;
import es.ucm.fdi.iw.model.Message;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

/**
 * Site administration.
 *
 * Access to this end-point is authenticated - see SecurityConfig
 */
@Controller
@RequestMapping("admin")
public class AdminController {

    private static final Logger log = LogManager.getLogger(AdminController.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] {"u", "url", "ws", "topics"}) {
            model.addAttribute(name, session.getAttribute(name));
        }
    }
    public Message findById(long id) {
        return entityManager.createNamedQuery("Message.findById", Message.class)
                            .setParameter("id", id)
                            .getSingleResult();
    }

    @GetMapping("/")
    public String index(Model model) {
        log.info("Admin acaba de entrar");

        model.addAttribute("users", 
             entityManager.createQuery("select u from User u").getResultList());
        
        model.addAttribute("torneos", 
            entityManager.createQuery("select t from Torneo t").getResultList());

        model.addAttribute("partidas", 
            entityManager.createQuery("select p from Partida p where p.estado = 'EN_CURSO'").getResultList());

        model.addAttribute("mensajes", 
            entityManager.createQuery("select m from Message m where m.reported=true").getResultList());

        return "admin";
    }

    @GetMapping("/search")
    @ResponseBody
    public List<User> searchUsers(@RequestParam String search) {
        log.info("Buscando usuarios con: " + search);
        return entityManager.createQuery("SELECT u FROM User u WHERE u.username LIKE :search", User.class)
                            .setParameter("search", "%" + search + "%")
                            .getResultList();
    }

    @GetMapping("/torneos")
    @ResponseBody
    public List<Torneo.Transfer> getTorneosByEstado(@RequestParam String estado) {
        log.info("Buscando torneos con estado: " + estado);
        List<Torneo> torneos;
        if (estado.isEmpty()) {
            torneos = entityManager.createQuery("SELECT t FROM Torneo t", Torneo.class).getResultList();
        } else {
            try {
                Torneo.EstadoTorneo estadoTorneo = Torneo.EstadoTorneo.valueOf(estado);
                torneos = entityManager.createQuery("SELECT t FROM Torneo t WHERE t.estado = :estado", Torneo.class)
                                        .setParameter("estado", estadoTorneo)
                                        .getResultList();
            } catch (IllegalArgumentException e) {
                log.error("Estado no válido: " + estado, e);
                return new ArrayList<>();
            }
        }
        return torneos.stream().map(Torneo::toTransfer).collect(Collectors.toList());
    }

    @GetMapping("/partidas")
    @ResponseBody
    public List<Partida.Transfer> getPartidasEnCurso() {
        log.info("Buscando partidas en curso");
        List<Partida> partida = entityManager.createQuery("SELECT p FROM Partida p WHERE p.estado = :estado", Partida.class)
            .setParameter("estado", Partida.EstadoPartida.EN_CURSO)
            .getResultList();
        return partida.stream()
        .map(Partida::toTransfer)
        .collect(Collectors.toList());
    }
    


    @PostMapping("/toggle/{id}")
    @Transactional
    @ResponseBody
    public String toggleUser(@PathVariable long id, Model model) {
        log.info("Admin cambia estado de " + id);
        User target = entityManager.find(User.class, id);
        target.setEnabled(!target.isEnabled());
        return "{\"enabled\":" + target.isEnabled() + "}";
    }

    @PostMapping("/populate")
    @ResponseBody
    @Transactional
    public String populate(Model model) {
        for (int i = 0; i < 10; i++) {
            User u = new User();
            u.setUsername("user" + i);
            u.setPassword(passwordEncoder
                .encode(UserController
                    .generateRandomBase64Token(9)));
            u.setEnabled(true);
            u.setRoles(User.Role.USER.toString());
            
            entityManager.persist(u);
        }
        return "{\"admin\": \"populated\"}";
    }


    @GetMapping("/reporte/{id}")
    public String verReporte(@PathVariable long id, Model model) {
        Message mensaje = entityManager.createNamedQuery("Message.findById", Message.class)
        .setParameter("id", id)
        .getSingleResult();
        model.addAttribute("mensaje", mensaje);
        return "reporte";
    }

    @PostMapping("/reporte/{id}/confirmar")
    @Transactional // Asegura que los cambios que se realizen dentro de la función se mentengan en la BD
    public String confirmarReporte(@PathVariable long id, @RequestParam String castigo) {
        Message mensaje = entityManager.createNamedQuery("Message.findById", Message.class)
        .setParameter("id", id)
        .getSingleResult();
        User emisor = mensaje.getEmisor();

        // Aplicar el castigo seleccionado
        switch (castigo) {
            case "ban":
                emisor.setEnabled(false); // Deshabilitar usuario
                break;
            default:
                throw new IllegalArgumentException("Castigo no válido: " + castigo);
        }
        
        mensaje.setReported(false);

        return "redirect:/admin/"; // Redirigir a la vista de administrador
    }

}

