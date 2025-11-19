package com.praktisk.it.prosjekt.data3710.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import com.praktisk.it.prosjekt.data3710.model.OpeningHours;
import com.praktisk.it.prosjekt.data3710.repo.OpeningHoursRepository;

@RestController
@RequestMapping("/api/opening-hours")
public class OpeningHoursController {

    @Autowired
    private OpeningHoursRepository repo;

    // HENT ALLE ÅPNINGSTIDER (for index.html)
    @GetMapping
    public List<OpeningHours> getAll() {
        return repo.findAll();
    }

    // OPPDATER EN ENKEL DAG (for min-side.html editor)
    @PostMapping("/{day}")
    public OpeningHours updateDay(
            @PathVariable String day,
            @RequestBody OpeningHours payload
    ) {
        payload.setDay(day.toLowerCase());
        return repo.save(payload);
    }
}
