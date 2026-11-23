package com.localproblems.os.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("prod")
public class FlywayRepairConfig {

    private static final Logger logger = LoggerFactory.getLogger(FlywayRepairConfig.class);

    @Bean
    public FlywayMigrationStrategy repairStrategy() {
        return flyway -> {
            try {
                logger.info("Running Flyway repair before migration...");
                // Repair any failed migrations before running new ones
                flyway.repair();
                logger.info("Flyway repair completed successfully");
                
                // Now run migrations
                logger.info("Running Flyway migrations...");
                flyway.migrate();
                logger.info("Flyway migrations completed successfully");
            } catch (Exception e) {
                logger.error("Error during Flyway migration: {}", e.getMessage());
                // Try to repair again and continue
                try {
                    logger.info("Attempting second repair...");
                    flyway.repair();
                    logger.info("Second repair completed, skipping migration to let Hibernate handle it");
                } catch (Exception repairEx) {
                    logger.warn("Second repair also failed, letting Hibernate handle schema: {}", repairEx.getMessage());
                }
            }
        };
    }
}
