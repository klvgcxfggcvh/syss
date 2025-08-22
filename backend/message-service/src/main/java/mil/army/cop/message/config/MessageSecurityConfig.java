package mil.army.cop.message.config;

import mil.army.cop.shared.security.SecurityConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class MessageSecurityConfig extends SecurityConfig {

    @Override
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        // Call parent configuration first
        SecurityFilterChain chain = super.filterChain(http, corsConfigurationSource);
        
        // Add service-specific configurations for WebSocket
        http.authorizeHttpRequests(authz -> authz
            // WebSocket handshake endpoints
            .requestMatchers("/ws/**").permitAll()
        );
        
        return chain;
    }
}
