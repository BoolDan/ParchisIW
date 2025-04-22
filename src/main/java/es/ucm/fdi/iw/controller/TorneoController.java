package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Jugador_torneo;
import es.ucm.fdi.iw.model.Torneo;
import es.ucm.fdi.iw.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

import java.time.LocalTime;
import java.util.List;

@Controller
@RequestMapping("/torneos")
public class TorneoController {

    @Autowired
    private EntityManager entityManager;

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {
        for (String name : new String[] {"u", "url", "ws", "topics"}) {
            model.addAttribute(name, session.getAttribute(name));
        }

        List<Torneo> torneosEnJuego = entityManager.createNamedQuery("Torneo.getEnJuego", Torneo.class).getResultList();
        List<Torneo> torneosAcabados = entityManager.createNamedQuery("Torneo.getAcabados", Torneo.class).getResultList();

        model.addAttribute("torneosEnJuego", torneosEnJuego);
        model.addAttribute("torneosAcabados", torneosAcabados);
    }

    @GetMapping("/clasificacionTorneos")
    public String getClasificacionTorneos(Model model) {
        return "clasificacionTorneos";
    }

    @GetMapping("/clasificacionAcabados")
    public String getClasificacionTorneosAcabados(Model model) {
        return "clasificacionAcabados";
    }

    @GetMapping("/crear")
    public String mostrarFormularioCrearTorneo(Model model) {
        model.addAttribute("torneo", new Torneo());
        return "crearTorneo";
    }

    @PostMapping("/crear")
    @Transactional
    public String crearTorneo(@ModelAttribute Torneo torneo) {
        torneo.setEstado(Torneo.EstadoTorneo.En_espera);
        entityManager.persist(torneo);
        return "redirect:/torneos/clasificacionTorneos";
    }

    
    @GetMapping("/{id}")
    public String getTorneoDetails(@PathVariable("id") long id, @RequestParam(value = "from", required = false) String from, Model model) {
        Torneo torneo = entityManager.find(Torneo.class, id);
        List<Jugador_torneo> jugadores = entityManager.createNamedQuery("Jugador_torneo.findByTorneo", Jugador_torneo.class)
                .setParameter("torneoId", id)
                .getResultList();
        model.addAttribute("torneo", torneo);
        model.addAttribute("jugadores", jugadores);
        model.addAttribute("from", from);

        return "torneoDetalles";
    }

    @GetMapping("/{id}/inscribirse")
    @Transactional
    public String inscribirseEnTorneo(@PathVariable("id") long id, @AuthenticationPrincipal UserDetails userDetails, Model model) {
        User usuario = entityManager.createNamedQuery("User.byUsername", User.class)
                .setParameter("username", userDetails.getUsername())
                .getSingleResult();
        Torneo torneo = entityManager.find(Torneo.class, id);

        if (torneo != null && usuario != null) {
            // Verificar si el usuario ya está inscrito en el torneo
            boolean yaInscrito = entityManager.createNamedQuery("Jugador_torneo.countByTorneoAndUsuario", Long.class)
                    .setParameter("torneoId", id)
                    .setParameter("usuarioId", usuario.getId())
                    .getSingleResult() > 0;

            if (!yaInscrito) {
                // Inscribir al usuario en el torneo
                Jugador_torneo jugadorTorneo = new Jugador_torneo();
                jugadorTorneo.setTorneo(torneo);
                jugadorTorneo.setUsuario(usuario);
                jugadorTorneo.setPuntuacion(0); // Inicialmente, la puntuación es 0
                entityManager.persist(jugadorTorneo);

                // Incrementar el número de participantes del torneo
                torneo.setNumParticipantes(torneo.getNumParticipantes() + 1);
                entityManager.merge(torneo);
            }
        }

        return "redirect:/torneos/" + id;
    }

    /**
     * Tarea programada para cerrar automáticamente los torneos cuya hora de fin ha pasado.
     */
    @Scheduled(fixedRate = 60000) // Ejecutar cada minuto
    @Transactional
    public void cerrarTorneosAutomaticamente() {
        LocalTime now = LocalTime.now();
        List<Torneo> torneos = entityManager.createQuery(
                "SELECT t FROM Torneo t WHERE t.horaFin <= :now AND t.estado = 'En_espera'", Torneo.class)
                .setParameter("now", now)
                .getResultList();

        for (Torneo torneo : torneos) {
            torneo.setEstado(Torneo.EstadoTorneo.Cerrado);
            entityManager.merge(torneo);
        }
    }
    
}