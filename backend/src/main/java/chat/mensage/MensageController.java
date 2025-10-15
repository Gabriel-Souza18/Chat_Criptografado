package chat.mensage;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mensages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MensageController {
    @GetMapping("/all")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> getAllMensages() {
        System.out.println("GET /mensages/all chamado");
        //Buscar Todas as mensagens e retornar
        return ResponseEntity.status(HttpStatus.OK).body("Todas as mensagens carregadas com sucesso");
    }

    @PostMapping("/add")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> addMensage(@RequestBody(required = false) String mensagem) {
        System.out.println("POST /mensages/add chamado");
        System.out.println("Mensagem recebida: " + mensagem);
        //Funcao pra add uma mensagem
        return ResponseEntity.status(HttpStatus.CREATED).body("Mensagem adicionada com sucesso");
    }
}
