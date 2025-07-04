package com.remembread.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserTokens {
    private final Boolean isAgreedTerms;
    private final String userId;
    private final String refreshToken;
    private final String accessToken;
}