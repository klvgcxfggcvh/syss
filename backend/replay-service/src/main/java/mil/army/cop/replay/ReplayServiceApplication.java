package mil.army.cop.replay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"mil.army.cop.replay", "mil.army.cop.shared"})
@EntityScan(basePackages = {"mil.army.cop.replay.entity"})
@EnableJpaRepositories(basePackages = {"mil.army.cop.replay.repository"})
public class ReplayServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReplayServiceApplication.class, args);
    }
}
