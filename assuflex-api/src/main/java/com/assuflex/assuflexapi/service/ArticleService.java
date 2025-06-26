package com.assuflex.assuflexapi.service;


import com.assuflex.assuflexapi.DTO.ArticleDTO;
import com.assuflex.assuflexapi.DTO.PaginationResponse;
import com.assuflex.assuflexapi.model.Article;
import com.assuflex.assuflexapi.repository.ArticleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Transactional
    public Article createArticle(ArticleDTO dto) {
        Article article = Article.builder()
                .categorie(dto.getCategorie())
                .titre(dto.getTitre())
                .contenu(dto.getContenu())
                .build();
        return articleRepository.save(article);
    }

    @Transactional
    public Article updateArticle(Long id, ArticleDTO dto) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article introuvable, ID = " + id));

        existing.setCategorie(dto.getCategorie());
        existing.setTitre(dto.getTitre());
        existing.setContenu(dto.getContenu());

        return articleRepository.save(existing);
    }

    @Transactional(readOnly = true)
    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article introuvable, ID = " + id));
    }

    @Transactional(readOnly = true)
    public List<ArticleDTO> getAllArticles() {

       return   articleRepository.findAll().stream()
                 .map(r->{
                     return ArticleDTO.builder()
                             .id(r.getId())
                             .datePublication(r.getCreatedAt().toLocalDate().atStartOfDay())
                             .titre(r.getTitre())
                             .status(r.getStatus())
                             .categorie(r.getCategorie())
                             .build();
                 }).toList();
    }

    @Transactional
    public void deleteArticleById(Long id) {
        Article existing = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article introuvable, ID = " + id));
        articleRepository.delete(existing);
    }

    public PaginationResponse<ArticleDTO> getArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articlePage = articleRepository.findAll(pageable);

        List<ArticleDTO> articleDTOs = articlePage.getContent().stream()
                .map(article -> ArticleDTO.builder()
                        .id(article.getId())
                        .categorie(article.getCategorie())
                        .titre(article.getTitre())
                        .contenu(article.getContenu())
                        .status(article.getStatus())
                        .build())
                .collect(Collectors.toList());

        return PaginationResponse.<ArticleDTO>builder()
                .content(articleDTOs)
                .pageNumber(articlePage.getNumber())
                .pageSize(articlePage.getSize())
                .totalElements(articlePage.getTotalElements())
                .totalPages(articlePage.getTotalPages())
                .last(articlePage.isLast())
                .build();
    }
}
