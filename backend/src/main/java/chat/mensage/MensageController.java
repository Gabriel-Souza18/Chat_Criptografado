package chat.mensage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class MensageController {

    private final MensageService mensageService;

    @GetMapping("/ultimas")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<MensageModel>> getUltimasMensages() {
        System.out.println("GET /mensagens/ultimas chamado");
        List<MensageModel> mensagens = mensageService.buscarUltimas10Mensagens();
        return ResponseEntity.status(HttpStatus.OK).body(mensagens);
    }

    @PostMapping
    @CrossOrigin(origins = "*")
    public ResponseEntity<MensageModel> addMensage(@RequestBody MensageModel mensagem) {
        System.out.println("POST /mensagens chamado");
        System.out.println("Mensagem recebida: " + mensagem);
        MensageModel mensagemSalva = mensageService.criarMensagem(mensagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(mensagemSalva);
    }
}
