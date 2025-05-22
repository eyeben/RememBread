package com.remembread.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.ToString;

@ToString
public class NaverUserInfo {

    @JsonProperty("response")
    private NaverAccount naverAccount;

    public String getSocialLoginId() {
        return naverAccount.socialLoginId;
    }

    public String getNickname() {
        return naverAccount.nickname;
    }

    private static class NaverAccount {
        @JsonProperty("id")
        private String socialLoginId;

        @JsonProperty("nickname")
        private String nickname;
    }
}