package es.ucm.fdi.iw.repository;

import es.ucm.fdi.iw.model.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TorneoRepository extends JpaRepository<Torneo, Long> {
    List<Torneo> findByEstado(Torneo.EstadoTorneo estado);
}