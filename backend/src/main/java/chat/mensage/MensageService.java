package chat.mensage;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensageService {

    private final MensageRepository mensageRepository;

    // Criar nova mensagem
    @Transactional
    public MensageModel criarMensagem(MensageModel mensagem) {
        return mensageRepository.save(mensagem);
    }

    // Buscar últimas 10 mensagens do chat global
    public List<MensageModel> buscarUltimas10Mensagens() {
        return mensageRepository.findUltimas10Mensagens();
    }
}
