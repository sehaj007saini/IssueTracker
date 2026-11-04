package com.localproblems.os;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LocalProblemsOsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocalProblemsOsApplication.class, args);
    }
}
