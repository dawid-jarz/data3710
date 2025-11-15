package com.praktisk.it.prosjekt.controller;
import org.springframework.stereotype.Controller; import org.springframework.web.bind.annotation.GetMapping;
@Controller public class LoginController { @GetMapping("/login") public String login(){ return "redirect:/html/min-side.html"; } }