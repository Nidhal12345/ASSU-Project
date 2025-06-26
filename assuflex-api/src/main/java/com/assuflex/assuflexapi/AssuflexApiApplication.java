package com.assuflex.assuflexapi;
import com.assuflex.assuflexapi.DTO.SignupRequest;
import com.assuflex.assuflexapi.repository.UserRepository;
import com.assuflex.assuflexapi.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
@EnableJpaAuditing
public class AssuflexApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssuflexApiApplication.class, args);
		System.out.println("application IS starting... MADE WITH LOVE BY SADDOURI");
	}

@Bean
	public CommandLineRunner commandLineRunner(ApplicationContext ctx, AuthService authService, UserRepository userRepository) {
		return args -> {

			if(!userRepository.existsByEmail("admin@admin.com")){
				SignupRequest signupRequest = SignupRequest.builder()
						.role("ROLE_ADMIN")
						.email("admin@admin.com")
						.password("admin123456")
						.username("nidhal")
						.build();

				authService.register(signupRequest);
			}
		};
	}
}