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

                // --- OFFENTLIG API (GET åpningstider skal fungere for ALLE) ---
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/opening-hours",
                        "/api/opening-hours/",
                        "/api/opening-hours/**"
                ).permitAll()

                // --- KUN INNLOGGET KAN ENDRE ÅPNINGSTIDER ---
                .requestMatchers(HttpMethod.POST, "/api/opening-hours/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/opening-hours/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/opening-hours/**").authenticated()
                
                // Priser – GET = offentlig, endring = innlogget
                .requestMatchers(HttpMethod.GET, "/api/prices", "/api/prices/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/prices/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/prices/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/prices/**").authenticated()

                // Innlegg – alle kan se, kun innloggede kan endre
                .requestMatchers(HttpMethod.GET, "/api/posts").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/posts/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()

                
                // --- AUTH STATUS OG LOGIN ---
                .requestMatchers("/api/auth/status").permitAll()
                .requestMatchers("/login").permitAll()

                // --- BESKYTTET SIDE ---
                .requestMatchers("/html/admin.html").authenticated()
                .requestMatchers("/html/min-side.html").authenticated()

                // --- STATISKE FILER ---
                .requestMatchers("/stylesheets/**").permitAll()
                .requestMatchers("/scripts/**").permitAll()
                .requestMatchers("/img/**").permitAll()
                .requestMatchers("/html/**").permitAll()

                // --- INDEX / ROOT ---
                .requestMatchers("/", "/index.html").permitAll()

                // --- H2 DATABASE ---
                .requestMatchers("/h2-console/**").authenticated()

                // --- ALT ANNET ---
                .anyRequest().permitAll()
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

            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
