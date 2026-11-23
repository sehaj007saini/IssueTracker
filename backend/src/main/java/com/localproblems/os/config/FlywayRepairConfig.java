package com.localproblems.os.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("prod")
public class FlywayRepairConfig {

    @Bean
    public FlywayMigrationStrategy repairStrategy() {
        return flyway -> {
            // Repair any failed migrations before running new ones
            flyway.repair();
            // Now run migrations
            flyway.migrate();
        };
    }
}
