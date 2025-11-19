package com.praktisk.it.prosjekt.data3710.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import com.praktisk.it.prosjekt.data3710.model.User;
import com.praktisk.it.prosjekt.data3710.repo.UserRepository;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    @GetMapping
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody User user) {

        if (repo.existsById(user.getUsername())) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return ResponseEntity.ok("User created");
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<String> delete(@PathVariable String username) {
        if (!repo.existsById(username)) {
            return ResponseEntity.badRequest().body("User does not exist");
        }

        repo.deleteById(username);
        return ResponseEntity.ok("User deleted");
    }
}
