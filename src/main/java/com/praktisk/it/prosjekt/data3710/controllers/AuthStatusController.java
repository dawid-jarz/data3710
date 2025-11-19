package com.praktisk.it.prosjekt.data3710.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class AuthStatusController {

    @GetMapping("/api/auth/status")
    public Map<String, Boolean> authStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean loggedIn = auth != null && auth.isAuthenticated() &&
                !(auth.getPrincipal().equals("anonymousUser"));

        return Map.of("loggedIn", loggedIn);
    }
}
