package com.revature.revtickets.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve all image types from the actual location where they're stored
        registry.addResourceHandler("/display/**")
            .addResourceLocations("file:backend/public/display/");
        
        registry.addResourceHandler("/banner/**")
            .addResourceLocations("file:backend/public/banner/");
            
        // Also serve from movies, events, banners subdirectories under images
        registry.addResourceHandler("/movies/**")
            .addResourceLocations("file:public/images/movies/", "file:backend/public/display/");
        
        registry.addResourceHandler("/events/**")
            .addResourceLocations("file:public/images/events/", "file:backend/public/display/");
        
        registry.addResourceHandler("/banners/**")
            .addResourceLocations("file:public/images/banners/", "file:backend/public/banner/");
    }
}
