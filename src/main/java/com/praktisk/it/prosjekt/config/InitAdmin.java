package com.praktisk.it.prosjekt.config;
import com.praktisk.it.prosjekt.model.User; import com.praktisk.it.prosjekt.repo.UserRepository;
import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.*; import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration public class InitAdmin {
  @Bean CommandLineRunner init(UserRepository repo, PasswordEncoder encoder){
    return args -> { if (repo.findByUsername("admin").isEmpty()){ repo.save(new User("admin", encoder.encode("admin123"), "ROLE_ADMIN")); System.out.println("✅ admin/admin123"); } };
  }
}