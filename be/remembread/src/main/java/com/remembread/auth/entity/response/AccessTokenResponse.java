package com.remembread.auth.entity.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccessTokenResponse {
    private Boolean isAgreedTerms;
    private String userId;
    private String accessToken;
}
