package com.remembread.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserCharacterResponse {
    Long id;
    String name;
    String description;
    String imageUrl;
    Boolean isLocked;

    public void updateIsLock(boolean isLocked) {
        this.isLocked = isLocked;
    }
}
