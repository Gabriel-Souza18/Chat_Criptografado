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

    @Column(nullable = false, columnDefinition = "TEXT")
    private String ConteudoCriptografado;

    @Column(nullable = false)
    private UUID IdUsuarioRemetente;

    @Column(nullable = false)
    private UUID IdUsuarioDestinatario;

    @CreationTimestamp
    private LocalDateTime Timestamp;

}
