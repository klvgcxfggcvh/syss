package mil.army.cop.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"mil.army.cop.auth", "mil.army.cop.shared"})
@EntityScan(basePackages = {"mil.army.cop.auth.entity"})
@EnableJpaRepositories(basePackages = {"mil.army.cop.auth.repository"})
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
