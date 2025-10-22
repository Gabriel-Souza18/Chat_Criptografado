package chat.mensage;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "TB_MENSAGE")
@Data
public class MensageModel {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;

    @Column(name = "conteudo_criptografado", nullable = false, columnDefinition = "TEXT")
    private String conteudoCriptografado;

    @Column(name = "id_usuario_remetente", nullable = false)
    private UUID idUsuarioRemetente;

    @CreationTimestamp
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
}
