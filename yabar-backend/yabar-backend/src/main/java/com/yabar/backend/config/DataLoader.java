package com.yabar.backend.config;

import com.yabar.backend.model.Usuario;
import com.yabar.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    public DataLoader(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Solo crea el usuario admin la primera vez. La contraseña nunca se guarda en texto plano.
        if (usuarioRepository.findByUsername(adminUsername).isEmpty()) {
            Usuario admin = new Usuario(adminUsername, passwordEncoder.encode(adminPassword));
            usuarioRepository.save(admin);
        }
    }
}
