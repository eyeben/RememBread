package com.remembread.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserCharacterResponseDto {
    Long id;
    String name;
    String imageUrl;
    Boolean isLocked;
}
