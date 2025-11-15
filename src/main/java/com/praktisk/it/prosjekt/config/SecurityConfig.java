package com.praktisk.it.prosjekt.config;
import com.praktisk.it.prosjekt.repo.UserRepository;
import org.springframework.context.annotation.*; import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*; import org.springframework.security.crypto.bcrypt.*; import org.springframework.security.crypto.password.*;
import org.springframework.security.web.SecurityFilterChain;
@Configuration public class SecurityConfig {
  @Bean public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf->csrf.disable())
      .authorizeHttpRequests(auth->auth
        .requestMatchers("/", "/index.html", "/html/**", "/stylesheets/**", "/scripts/**", "/images/**", "/favicon.ico", "/api/me").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
        .requestMatchers("/html/admin.html").hasRole("ADMIN")
        .requestMatchers(HttpMethod.POST, "/api/articles/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/articles/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/articles/**").hasRole("ADMIN")
        .anyRequest().permitAll())
      .formLogin(login->login.loginPage("/html/min-side.html").loginProcessingUrl("/login").defaultSuccessUrl("/index.html", true).permitAll())
      .logout(logout->logout.logoutUrl("/logout").logoutSuccessUrl("/index.html").permitAll());
    return http.build();
  }
  @Bean public UserDetailsService userDetailsService(UserRepository repo){
    return username -> repo.findByUsername(username).map(u-> User.withUsername(u.getUsername()).password(u.getPassword()).roles("ADMIN").build())
      .orElseThrow(()-> new UsernameNotFoundException("User not found"));
  }
  @Bean public PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
}