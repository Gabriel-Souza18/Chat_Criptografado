package chat.mensage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MensageController {

    private final MensageService mensageService;

    // POST /api/mensagens - Criar nova mensagem
    @PostMapping
    public ResponseEntity<MensageModel> criarMensagem(@RequestBody MensageModel mensagem) {
        MensageModel novaMensagem = mensageService.criarMensagem(mensagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMensagem);
    }

    // GET /api/mensagens/ultimas - Buscar últimas 10 mensagens do chat global
    @GetMapping("/ultimas")
    public ResponseEntity<List<MensageModel>> buscarUltimas10() {
        List<MensageModel> mensagens = mensageService.buscarUltimas10Mensagens();
        return ResponseEntity.ok(mensagens);
    }
}
