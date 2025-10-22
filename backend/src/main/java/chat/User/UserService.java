package chat.User;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Criar novo usuário
    @Transactional
    public UserModel criarUsuario(UserModel usuario) {
        if (userRepository.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("Username já existe!");
        }
        return userRepository.save(usuario);
    }

    // Buscar usuário por ID
    public Optional<UserModel> buscarPorId(UUID id) {
        return userRepository.findById(id);
    }
    
    // Buscar usuário por username
    public Optional<UserModel> buscarPorUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Listar todos os usuários
    public List<UserModel> listarTodos() {
        return userRepository.findAll();
    }
}
