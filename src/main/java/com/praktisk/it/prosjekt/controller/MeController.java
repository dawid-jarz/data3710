package com.praktisk.it.prosjekt.controller;
import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api") public class MeController {
  @GetMapping("/me") public Map<String,Object> me(Authentication auth){
    if(auth==null) return Map.of("authenticated", false); return Map.of("authenticated", true, "name", auth.getName()); }
}