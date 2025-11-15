package com.praktisk.it.prosjekt.repo;
import com.praktisk.it.prosjekt.model.User; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> { Optional<User> findByUsername(String username); }