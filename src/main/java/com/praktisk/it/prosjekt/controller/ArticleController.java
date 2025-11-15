package com.praktisk.it.prosjekt.controller;
import com.praktisk.it.prosjekt.model.Article; import com.praktisk.it.prosjekt.repo.ArticleRepository;
import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.net.URI; import java.util.*;
@RestController @RequestMapping("/api/articles") public class ArticleController {
  private final ArticleRepository repo; public ArticleController(ArticleRepository repo){ this.repo = repo; }
  @GetMapping public List<Article> getAll(){ List<Article> list = repo.findAll(); list.sort(Comparator.comparing(Article::getCreatedAt).reversed()); return list; }
  @PostMapping public ResponseEntity<Article> create(@RequestBody Article a){ Article saved = repo.save(a); return ResponseEntity.created(URI.create("/api/articles/"+saved.getId())).body(saved); }
  @PutMapping("/{id}") public ResponseEntity<Article> update(@PathVariable Long id, @RequestBody Article p){
    return repo.findById(id).map(a->{ a.setTitle(p.getTitle()); a.setContent(p.getContent()); return ResponseEntity.ok(repo.save(a)); }).orElse(ResponseEntity.notFound().build());
  }
  @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){
    if(repo.existsById(id)){ repo.deleteById(id); return ResponseEntity.noContent().build(); } return ResponseEntity.notFound().build();
  }
}