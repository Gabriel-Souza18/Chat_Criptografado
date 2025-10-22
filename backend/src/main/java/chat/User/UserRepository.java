package chat.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID> {

    // Buscar usuário por username
    Optional<UserModel> findByUsername(String username);

    // Verificar se username já existe
    boolean existsByUsername(String username);
}
