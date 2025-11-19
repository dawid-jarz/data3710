package com.praktisk.it.prosjekt.data3710.repo;

import com.praktisk.it.prosjekt.data3710.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
