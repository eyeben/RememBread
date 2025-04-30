package com.remembread;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RemembreadApplication {

	public static void main(String[] args) {
		SpringApplication.run(RemembreadApplication.class, args);
	}

}
