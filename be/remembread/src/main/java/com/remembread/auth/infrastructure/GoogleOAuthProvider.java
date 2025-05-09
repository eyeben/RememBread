package com.remembread.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class GoogleOAuthProvider {

    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;
//    private final String redirectUri;
    private final String tokenUri;
    private final String userInfoUri;

    public GoogleOAuthProvider(
            @Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId,
            @Value("${spring.security.oauth2.client.registration.google.client-secret}") String clientSecret,
//            @Value("${spring.security.oauth2.client.registration.google.redirect-uri}") String redirectUri,
            @Value("${spring.security.oauth2.client.provider.google.token-uri}") String tokenUri,
            @Value("${spring.security.oauth2.client.provider.google.user-info-uri}") String userInfoUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
//        this.redirectUri = redirectUri;
        this.tokenUri = tokenUri;
        this.userInfoUri = userInfoUri;
        this.restTemplate = new RestTemplate();
    }

    public GoogleUserInfo getUserInfo(String code, String redirectUri) {
        String accessToken = fetchAccessToken(code, redirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, Boolean> params = new HashMap<>();
        params.put("secure_resource", true);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<GoogleUserInfo> response = restTemplate.exchange(
                userInfoUri,
                HttpMethod.GET,
                requestEntity,
                GoogleUserInfo.class,
                params
        );

        log.info("GoogleAuthProvider.getUserInfo response={}", response.getBody());

        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        }

        throw new GeneralException(ErrorStatus.UNABLE_TO_GET_USER_INFO);
    }

    private String fetchAccessToken(String code, String redirectUri) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        ResponseEntity<GoogleAccessTokenResponse> response = restTemplate.exchange(
                tokenUri,
                HttpMethod.POST,
                requestEntity,
                GoogleAccessTokenResponse.class
        );

        log.info("GoogleOAuthProvider.fetchAccessToken response={}", response.getBody());

        log.info("response={}", response.getBody());

        return Optional.ofNullable(response.getBody())
                .orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_ACCESS_TOKEN))
                .getAccessToken();
    }

    @Getter
    @ToString
    public static class GoogleAccessTokenResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("refresh_token")
        private String refreshToken;

        @JsonProperty("expires_in")
        private Integer expiresIn;
    }
}
