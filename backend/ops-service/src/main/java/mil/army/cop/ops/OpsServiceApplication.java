package mil.army.cop.ops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"mil.army.cop.ops", "mil.army.cop.shared"})
@EntityScan(basePackages = {"mil.army.cop.ops.entity"})
@EnableJpaRepositories(basePackages = {"mil.army.cop.ops.repository"})
public class OpsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpsServiceApplication.class, args);
    }
}
