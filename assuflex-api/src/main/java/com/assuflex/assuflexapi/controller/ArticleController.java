package com.assuflex.assuflexapi.controller;
import com.assuflex.assuflexapi.DTO.ArticleDTO;
import com.assuflex.assuflexapi.DTO.PaginationResponse;
import com.assuflex.assuflexapi.model.Article;
import com.assuflex.assuflexapi.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> createArticle(@Valid @RequestBody ArticleDTO dto) {
        Article created = articleService.createArticle(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ArticleDTO>> getAllArticles() {
        List<ArticleDTO> list = articleService.getAllArticles();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/pagination")
    public ResponseEntity<PaginationResponse<ArticleDTO>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("helllo");
        PaginationResponse<ArticleDTO> response = articleService.getArticles(page, size);
        return ResponseEntity.ok(response);
    }


@GetMapping("/{id}")
public ResponseEntity<Article> getArticleById(@PathVariable("id") Long id) {
    Article article = articleService.getArticleById(id);
    return ResponseEntity.ok(article);
}

@PutMapping("/{id}")
public ResponseEntity<Article> updateArticle(
        @PathVariable("id") Long id,
        @Valid @RequestBody ArticleDTO dto) {
    Article updated = articleService.updateArticle(id, dto);
    return ResponseEntity.ok(updated);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteArticle(@PathVariable("id") Long id) {
    articleService.deleteArticleById(id);
    return ResponseEntity.noContent().build();
}

}

