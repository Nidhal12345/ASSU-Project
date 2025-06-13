package com.assuflex.assuflexapi.security;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class Security {

    private final JwtFilter jwtFilter;

    private final AuthenticationProvider authenticationProvider;

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(
                            "/api/v1/auth/**",
                            "/api/v1/blog/**",
                            "/api/v1/devis/**",
                            "/checkout",
                            "/api/v1/password/reset",
                            "/api/payments/**",
                            "/uploads/quotes/**"
                            ).permitAll()

                    .requestMatchers(
                            "/api/v1/users/**",
                            "/api/v1/quotes/demande-devis",
                            "/api/v1/quotes/client",
                            "/api/v1/profile/**"
                    ).authenticated()

                    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                    .requestMatchers("/api/v1/users/**").hasAnyRole("ADMIN", "CLIENT","GESTIONNAIRE")
                    .requestMatchers("/api/v1/transactions/**").hasAnyRole( "CLIENT","GESTIONNAIRE")
                    .requestMatchers("/api/v1/quotes/**").hasAnyRole( "CLIENT","GESTIONNAIRE")
                    .requestMatchers("/api/v1/integrateur/**").hasRole("INTEGRATEUR")
                    .anyRequest().denyAll()
            )
            .sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
            return http.build();
}


}
