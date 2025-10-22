package chat.mensage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MensageRepository extends JpaRepository<MensageModel, UUID> {

    // Buscar últimas 10 mensagens do chat global
    @Query(value = "SELECT * FROM TB_MENSAGE ORDER BY timestamp DESC LIMIT 10", nativeQuery = true)
    List<MensageModel> findUltimas10Mensagens();
}
