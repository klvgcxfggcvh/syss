package mil.army.cop.task;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"mil.army.cop.task", "mil.army.cop.shared"})
@EntityScan(basePackages = {"mil.army.cop.task.entity"})
@EnableJpaRepositories(basePackages = {"mil.army.cop.task.repository"})
public class TaskServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskServiceApplication.class, args);
    }
}
