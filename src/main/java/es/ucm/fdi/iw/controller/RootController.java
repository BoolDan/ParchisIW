package es.ucm.fdi.iw.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestParam;


/**
 *  Non-authenticated requests only.
 */
@Controller
public class RootController {

    private static final Logger log = LogManager.getLogger(RootController.class);

    @ModelAttribute
    public void populateModel(HttpSession session, Model model) {        
        for (String name : new String[] {"u", "url", "ws"}) {
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

  /*  @GetMapping("/clasificacion")
    public String clasificacion(Model model) {
        return "clasificacion";
    }
*/
    @GetMapping("/clasificacionTorneos")
    public String clasificacionTorneos(Model model) {
     //   return "clasificacionTorneos";   ahora es el TorneoController quien se encarga de esto
        return "redirect:/torneos/clasificacion";
    }

    @GetMapping("/clasificacionAcabados")
    public String clasificacionAcabados(Model model) {
        return "clasificacionAcabados";
    }

    @GetMapping("/lobby")
    public String lobby(Model model) {
        return "lobby";
    }

    @GetMapping("/reglas")
    public String reglas(Model model) {
        return "reglas";
    }
    
}
