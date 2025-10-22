package chat.User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    // POST /api/users - Criar novo usuário
    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody UserModel usuario) {
        try {
            UserModel novoUsuario = userService.criarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/users - Listar todos os usuários
    @GetMapping
    public ResponseEntity<List<UserModel>> listarTodos() {
        return ResponseEntity.ok(userService.listarTodos());
    }

    // GET /api/users/{id} - Buscar usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<UserModel> buscarPorId(@PathVariable UUID id) {
        return userService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/users/username/{username} - Buscar por username
    @GetMapping("/username/{username}")
    public ResponseEntity<UserModel> buscarPorUsername(@PathVariable String username) {
        return userService.buscarPorUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
