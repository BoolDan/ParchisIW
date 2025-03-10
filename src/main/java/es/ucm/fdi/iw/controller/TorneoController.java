package es.ucm.fdi.iw.controller;

import es.ucm.fdi.iw.model.Torneo;
import es.ucm.fdi.iw.repository.TorneoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/torneos")
public class TorneoController {

    @Autowired
    private TorneoRepository torneoRepository;

    @GetMapping("/clasificacion")
    public String getClasificacionTorneos(Model model) {
        List<Torneo.Transfer> torneosEnJuego = torneoRepository.findByEstado(Torneo.EstadoTorneo.En_espera)
                .stream()
                .map(Torneo::toTransfer)
                .collect(Collectors.toList());

        List<Torneo.Transfer> torneosAcabados = torneoRepository.findByEstado(Torneo.EstadoTorneo.Cerrado)
                .stream()
                .map(Torneo::toTransfer)
                .collect(Collectors.toList());

        model.addAttribute("torneosEnJuego", torneosEnJuego);
        model.addAttribute("torneosAcabados", torneosAcabados);

        return "clasificacionTorneos";
    }
}