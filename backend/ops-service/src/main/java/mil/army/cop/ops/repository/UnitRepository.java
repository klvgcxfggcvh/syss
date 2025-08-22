package mil.army.cop.ops.repository;

import mil.army.cop.ops.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UnitRepository extends JpaRepository<Unit, UUID> {
    Optional<Unit> findByCallSign(String callSign);
    List<Unit> findByStatus(Unit.UnitStatus status);
    List<Unit> findByCommanderId(String commanderId);
    
    @Query("SELECT u FROM Unit u WHERE u.lastUpdate > :since ORDER BY u.lastUpdate DESC")
    List<Unit> findRecentlyUpdated(@Param("since") LocalDateTime since);
    
    @Query("SELECT u FROM Unit u WHERE u.callSign IN :callSigns")
    List<Unit> findByCallSignIn(@Param("callSigns") List<String> callSigns);
}
