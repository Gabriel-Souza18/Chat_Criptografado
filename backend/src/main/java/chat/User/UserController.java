package chat.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/all")
    public ResponseEntity<String> getAllUsers(@PathVariable UUID id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Id invalido");
        }
        //Buscar Todos os users e retornar
        return ResponseEntity.status(HttpStatus.OK).body("Todos os users");
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getUserById(@PathVariable UUID id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Id invalido");
        }
        //Funcao pra buscar um user
        return ResponseEntity.status(HttpStatus.OK).body("User do id");
    }

    @PostMapping("/add")
    public ResponseEntity<String> addUser(@RequestBody UserModel user) {
        if (user.getUsername() == null || user.getSecretKey() == null || user.getPublicKey() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Faltando campos obrigatórios");
        }
        //Funcao pra add um user
        return ResponseEntity.status(HttpStatus.CREATED).body("User: "+user.getUsername() +" adicionado com sucesso");
    }
}
