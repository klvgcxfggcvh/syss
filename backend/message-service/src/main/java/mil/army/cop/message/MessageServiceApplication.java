package mil.army.cop.message;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"mil.army.cop.message", "mil.army.cop.shared"})
@EntityScan(basePackages = {"mil.army.cop.message.entity"})
@EnableJpaRepositories(basePackages = {"mil.army.cop.message.repository"})
public class MessageServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MessageServiceApplication.class, args);
    }
}
