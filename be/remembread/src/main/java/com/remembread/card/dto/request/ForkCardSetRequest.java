package com.remembread.card.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ForkCardSetRequest {
    @Schema(description = "카드셋을 복사할 대상 폴더의 ID", example = "123", required = false)
    private Long folderId = null;
}
