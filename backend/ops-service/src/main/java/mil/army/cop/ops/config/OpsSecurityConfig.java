package mil.army.cop.ops.config;

import mil.army.cop.shared.security.SecurityConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class OpsSecurityConfig extends SecurityConfig {

    @Override
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        // Call parent configuration first
        SecurityFilterChain chain = super.filterChain(http, corsConfigurationSource);
        
        // Add service-specific configurations
        http.authorizeHttpRequests(authz -> authz
            // SSE endpoints need special handling
            .requestMatchers("/api/ops/*/stream/**").hasAnyRole("HQ", "UNIT", "OBSERVER")
        );
        
        return chain;
    }
}
