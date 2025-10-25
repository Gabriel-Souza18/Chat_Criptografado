package chat.mensage;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "TB_MENSAGE")
@Data
public class MensageModel {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "conteudo_criptografado", nullable = false, columnDefinition = "TEXT")
    private String conteudoCriptografado;

    @Column(name = "id_usuario_remetente", nullable = false)
    private UUID idUsuarioRemetente;

    @Column(name = "id_usuario_destinatario", nullable = false)
    private UUID idUsuarioDestinatario;

    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
