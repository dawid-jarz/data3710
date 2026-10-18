package com.praktisk.it.prosjekt.data3710.repo;

import com.praktisk.it.prosjekt.data3710.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
