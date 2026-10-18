package com.praktisk.it.prosjekt.data3710.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .authorizeHttpRequests(auth -> auth

                // Offentlige data og sider
                .requestMatchers(HttpMethod.GET,
                        "/api/opening-hours", "/api/priser", "/api/posts",
                        "/api/auth/status", "/api/csrf").permitAll()
                .requestMatchers("/login", "/error", "/favicon.ico").permitAll()

                // Krever pålogging for alle skriveoperasjoner
                .requestMatchers("/api/opening-hours/**", "/api/priser/**", "/api/posts/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/priser", "/api/posts").authenticated()
                .requestMatchers("/html/min-side.html", "/html/admin.html").authenticated()

                // Brukeradministrasjon: ingen vanlige brukere får tilgang.
                // ADMIN-rollen må opprettes og tildeles separat før dette kan brukes.
                .requestMatchers("/admin/**").hasRole("ADMIN")

                .requestMatchers("/stylesheets/**", "/scripts/**", "/img/**", "/html/**",
                        "/", "/index.html").permitAll()
                .anyRequest().denyAll()
            )

            .formLogin(form -> form
                    .loginPage("/login")
                    .defaultSuccessUrl("/index.html", true)
                    .permitAll()
            )

            .logout(logout -> logout
                    .logoutSuccessUrl("/login?logout")
                    .permitAll()
            )

            // CSRF er aktivert (standard). JS henter token fra /api/csrf.
            ;

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
