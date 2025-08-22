package mil.army.cop.report;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"mil.army.cop.report", "mil.army.cop.shared"})
@EntityScan(basePackages = {"mil.army.cop.report.entity"})
@EnableJpaRepositories(basePackages = {"mil.army.cop.report.repository"})
public class ReportServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReportServiceApplication.class, args);
    }
}
