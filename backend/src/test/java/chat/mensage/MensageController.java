package chat.mensage;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mensages")
public class MensageController {
    @GetMapping("/all")
    public ResponseEntity<String> getAllMensages() {
        //Buscar Todas as mensagens e retornar
        return ResponseEntity.status(HttpStatus.OK).body("Todas as mensagens");
    }

    @PostMapping("/add")
    public ResponseEntity<String> addMensage() {
        //Funcao pra add uma mensagem
        return ResponseEntity.status(HttpStatus.CREATED).body("Mensagem adicionada com sucesso");
    }
}
