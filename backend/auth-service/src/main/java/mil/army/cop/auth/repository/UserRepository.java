package mil.army.cop.auth.repository;

import mil.army.cop.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByKeycloakId(String keycloakId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByUnit(String unit);
    List<User> findByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.roles LIKE %:role%")
    List<User> findByRole(String role);
}
