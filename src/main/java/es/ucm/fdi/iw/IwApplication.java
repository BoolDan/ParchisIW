package es.ucm.fdi.iw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Habilita la programación de tareas
public class IwApplication {

	public static void main(String[] args) {
		SpringApplication.run(IwApplication.class, args);
	}

}
