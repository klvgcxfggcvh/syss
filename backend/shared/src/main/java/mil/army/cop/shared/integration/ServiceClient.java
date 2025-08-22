package mil.army.cop.shared.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ServiceClient {

    private final RestTemplate restTemplate;

    @Value("${app.services.auth-service.url:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${app.services.ops-service.url:http://localhost:8082}")
    private String opsServiceUrl;

    @Value("${app.services.cop-service.url:http://localhost:8083}")
    private String copServiceUrl;

    @Value("${app.services.task-service.url:http://localhost:8084}")
    private String taskServiceUrl;

    @Value("${app.services.report-service.url:http://localhost:8085}")
    private String reportServiceUrl;

    @Value("${app.services.message-service.url:http://localhost:8086}")
    private String messageServiceUrl;

    @Value("${app.services.replay-service.url:http://localhost:8087}")
    private String replayServiceUrl;

    public ServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public <T> ResponseEntity<T> callAuthService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(authServiceUrl, endpoint, method, body, responseType);
    }

    public <T> ResponseEntity<T> callOpsService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(opsServiceUrl, endpoint, method, body, responseType);
    }

    public <T> ResponseEntity<T> callCopService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(copServiceUrl, endpoint, method, body, responseType);
    }

    public <T> ResponseEntity<T> callTaskService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(taskServiceUrl, endpoint, method, body, responseType);
    }

    public <T> ResponseEntity<T> callReportService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(reportServiceUrl, endpoint, method, body, responseType);
    }

    public <T> ResponseEntity<T> callMessageService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(messageServiceUrl, endpoint, method, body, responseType);
    }

    public <T> ResponseEntity<T> callReplayService(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return callService(replayServiceUrl, endpoint, method, body, responseType);
    }

    private <T> ResponseEntity<T> callService(String baseUrl, String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        String url = baseUrl + endpoint;
        HttpHeaders headers = createAuthHeaders();
        HttpEntity<?> entity = new HttpEntity<>(body, headers);
        
        return restTemplate.exchange(url, method, entity, responseType);
    }

    private HttpHeaders createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        
        // Forward JWT token from current security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            headers.setBearerAuth(jwt.getTokenValue());
        }
        
        return headers;
    }
}
