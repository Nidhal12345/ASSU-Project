package com.assuflex.assuflexapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String projectDir = System.getProperty("user.dir");

        registry.addResourceHandler("/uploads/quotes/**")
                .addResourceLocations("file:" + projectDir + "/uploads/quotes/");

        registry.addResourceHandler("/uploads/contracts/**")
                .addResourceLocations("file:" + projectDir + "/uploads/contracts/");
    }

        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("*");
        }
}
