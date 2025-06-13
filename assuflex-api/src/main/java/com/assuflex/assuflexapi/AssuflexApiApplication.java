package com.assuflex.assuflexapi;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
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
}