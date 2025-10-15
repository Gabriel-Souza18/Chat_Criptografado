package chat.User;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "TB_USER")
public class UserModel {

    @Id
    @GeneratedValue(generator = "UUID")
    private UUID Id;

    @Column(nullable = false, unique = true)
    private String Username;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String SecretKey;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String PublicKey;

    @CreationTimestamp
    private LocalDateTime CreatedAt;
}
