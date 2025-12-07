package com.praktisk.it.prosjekt.data3710;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class Data3710Application {

	public static void main(String[] args) {
		SpringApplication.run(Data3710Application.class, args);
	}


	@Bean
	CommandLineRunner printHash(PasswordEncoder encoder) {
		return args -> {
			System.out.println(encoder.encode("Admin123!"));
		};
	}
}
