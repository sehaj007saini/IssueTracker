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
        
        // Fix Render's PostgreSQL URL format if needed
        String fixedUrl = datasourceUrl;
        if (datasourceUrl.startsWith("postgresql://") && !datasourceUrl.startsWith("jdbc:")) {
            fixedUrl = "jdbc:" + datasourceUrl;
        }
        
        config.setJdbcUrl(fixedUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        
        return new HikariDataSource(config);
    }
}
