package com.praktisk.it.prosjekt.data3710.controllers;

import com.praktisk.it.prosjekt.data3710.model.Post;
import com.praktisk.it.prosjekt.data3710.repo.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository repo;

    public PostController(PostRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Post> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        post.setCreatedAt(LocalDateTime.now());
        return repo.save(post);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Post updatedPost) {
        Post p = repo.findById(id).orElseThrow();
        p.setTitle(updatedPost.getTitle());
        p.setContent(updatedPost.getContent());
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
