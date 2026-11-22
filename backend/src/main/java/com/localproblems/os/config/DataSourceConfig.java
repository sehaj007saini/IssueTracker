package com.localproblems.os.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    @ConditionalOnProperty(name = "spring.datasource.url")
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        // Parse and fix Render's PostgreSQL URL format
        // Render format: postgresql://user:pass@host:port/database
        // JDBC format: jdbc:postgresql://host:port/database
        String fixedUrl = datasourceUrl;
        String extractedUsername = username;
        String extractedPassword = password;
        
        if (datasourceUrl.startsWith("postgresql://")) {
            // Parse: postgresql://user:pass@host:port/database or postgresql://user:pass@host/database
            String urlWithoutProtocol = datasourceUrl.substring("postgresql://".length());
            
            // Extract credentials if present in URL
            if (urlWithoutProtocol.contains("@")) {
                String[] parts = urlWithoutProtocol.split("@", 2);
                String credentials = parts[0];
                String hostAndDb = parts[1];
                
                // Extract username and password
                if (credentials.contains(":")) {
                    String[] credParts = credentials.split(":", 2);
                    extractedUsername = credParts[0];
                    extractedPassword = credParts[1];
                }
                
                // Check if port is specified, if not add default PostgreSQL port
                if (!hostAndDb.matches(".*:\\d+/.*")) {
                    // No port specified, add default port 5432
                    int slashIndex = hostAndDb.indexOf("/");
                    if (slashIndex > 0) {
                        String host = hostAndDb.substring(0, slashIndex);
                        String database = hostAndDb.substring(slashIndex);
                        hostAndDb = host + ":5432" + database;
                    }
                }
                
                // Rebuild URL in JDBC format
                fixedUrl = "jdbc:postgresql://" + hostAndDb;
            } else {
                // No credentials in URL, just add jdbc: prefix
                fixedUrl = "jdbc:" + datasourceUrl;
            }
        }
        
        config.setJdbcUrl(fixedUrl);
        config.setUsername(extractedUsername);
        config.setPassword(extractedPassword);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        
        return new HikariDataSource(config);
    }
}
