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
        System.out.println(new File("uploads/quotes").getAbsolutePath());
        File testFile = new File("C:/assuflex/assuflex-api/uploads/quotes/46/1747543411815.svg");
        System.out.println("File exists? " + testFile.exists());
        System.out.println("Absolute path: " + testFile.getAbsolutePath());
        registry
                .addResourceHandler("/uploads/quotes/**")
                .addResourceLocations("file:/C:/assuflex/assuflex-api/uploads/quotes/");
    }

        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("*");
        }
}
