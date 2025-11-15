package com.praktisk.it.prosjekt.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity public class Article {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  private String title;
  @Column(length=10000) private String content;
  private LocalDateTime createdAt = LocalDateTime.now();
  public Article() {}
  public Article(String title,String content){this.title=title;this.content=content;}
  public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
  public String getContent(){return content;} public void setContent(String c){this.content=c;}
  public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){this.createdAt=t;}
}