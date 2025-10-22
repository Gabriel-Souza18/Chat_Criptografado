package chat.mensage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MensageRepository extends JpaRepository<MensageModel, UUID> {

    // Buscar últimas 10 mensagens do chat global
    List<MensageModel> findTop10ByOrderByTimestampDesc();
}
