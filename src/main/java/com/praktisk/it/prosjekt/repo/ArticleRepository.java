package com.praktisk.it.prosjekt.repo;
import com.praktisk.it.prosjekt.model.Article; import org.springframework.data.jpa.repository.JpaRepository;
public interface ArticleRepository extends JpaRepository<Article, Long> {}