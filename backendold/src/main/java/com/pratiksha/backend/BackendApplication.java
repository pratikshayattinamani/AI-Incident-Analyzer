package com.pratiksha.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    @Value("${spring.data.mongodb.uri:NOT_FOUND}")
    private String mongoUri;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner test() {
        return args -> {
            System.out.println("Mongo URI = " + mongoUri);
        };
    }
}
