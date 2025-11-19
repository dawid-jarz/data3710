package com.praktisk.it.prosjekt.data3710.controllers;

import com.praktisk.it.prosjekt.data3710.model.Price;
import com.praktisk.it.prosjekt.data3710.repo.PriceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
public class PriceController {

    private final PriceRepository repo;

    public PriceController(PriceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Price> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Price create(@RequestBody Price p) {
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public Price update(@PathVariable Long id, @RequestBody Price p) {
        Price existing = repo.findById(id).orElseThrow();
        existing.setName(p.getName());
        existing.setPrice(p.getPrice());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
