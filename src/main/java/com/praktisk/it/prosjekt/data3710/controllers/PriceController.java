package com.praktisk.it.prosjekt.data3710.controllers;

import com.praktisk.it.prosjekt.data3710.model.Price;
import com.praktisk.it.prosjekt.data3710.repo.PriceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/priser")
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
        Price existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tjenesten finnes ikke"));
        existing.setName(p.getName());
        existing.setPrice(p.getPrice());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tjenesten finnes ikke");
        }
        repo.deleteById(id);
    }
}
