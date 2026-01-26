package com.pm.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS (Cross-Origin Resource Sharing) configuration for Spring Cloud Gateway.
 * 
 * This configuration enables the frontend application (Next.js) to communicate
 * with the backend API Gateway from a different origin (port).
 * 
 * Security Considerations:
 * - Uses explicit allowed origins (no wildcards) for better security
 * - Credentials enabled to support JWT token authentication
 * - Explicit method and header allowlisting
 * - Configurable via application.yml for different environments
 */
@Configuration
public class CorsConfig {

    /**
     * Allowed origins for CORS requests.
     * Configured via application.yml:
     * - Development: http://localhost:3000
     * - Production: https://your-production-domain.com
     */
    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String[] allowedOrigins;

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allowed origins - configurable per environment
        corsConfig.setAllowedOrigins(Arrays.asList(allowedOrigins));
        
        // Allowed HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", 
            "POST", 
            "PUT", 
            "DELETE", 
            "OPTIONS", 
            "PATCH"
        ));
        
        // Allowed headers - explicit list is more secure than "*"
        // Note: For development we use "*", but production should specify exact headers
        corsConfig.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin"
        ));
        
        // Expose headers that the browser can access
        corsConfig.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Disposition"
        ));
        
        // Allow credentials (required for JWT tokens in Authorization header)
        // NOTE: When true, allowedOrigins cannot use "*"
        corsConfig.setAllowCredentials(true);
        
        // Cache preflight responses for 1 hour to reduce OPTIONS requests
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // Apply CORS configuration to all API Gateway routes
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
