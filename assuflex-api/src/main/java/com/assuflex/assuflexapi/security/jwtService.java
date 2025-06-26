package com.assuflex.assuflexapi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class jwtService {
    @Value("{application.security.jwt.secret-key}")
    String secretKey;

        public String generateToken(UserDetails userDetails){
            return generateToken(new HashMap<>(),userDetails);
        }

        public String extractUsername(String token){
            return extractClaims(token, Claims::getSubject);
        }
        public <T> T extractClaims(String token, Function<Claims,T> claimsResolver){
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        }

    private Claims extractAllClaims(String token) {
            return Jwts
                    .parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
    }

    public String generateToken(Map<String, Object> claims, UserDetails userDetails){
            return buildToken(claims,userDetails);
        }

        private String buildToken(Map<String, Object> ExtraClaims, UserDetails userDetails) {

            var authorities = userDetails
                    .getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return Jwts
                    .builder()
                    .claims(ExtraClaims)
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis() + (long) 840000000))
                    .claim("authorities",authorities)
                    .signWith(getSignInKey())
                    .compact();
        }

        public boolean isTokenValid(String token,UserDetails userDetails){
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !istokenExpired(token);
        }

    private boolean istokenExpired(String token) {
            return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
            return extractClaims(token,Claims::getExpiration);
    }
    private SecretKey getSignInKey() {
        return new SecretKeySpec(secretKey.getBytes(), "HMACSHA256");
    };
    }
