package com.remembread.card.controller;

import com.remembread.apipayload.ApiResponse;
import com.remembread.auth.annotation.AuthUser;
import com.remembread.card.dto.response.TTSResponse;
import com.remembread.card.service.TTSService;
import com.remembread.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tss")
@RequiredArgsConstructor
public class TTSController {

    private final TTSService ttsService;

    @GetMapping("/{cardSetId}")
    @Operation(summary = "카드셋별 TTS 파일 조회 API", description = "특정 카드셋에 대한 TTS 파일을 조회하는 API 입니다.")
    public ApiResponse<List<TTSResponse>> getTTSFileByCardSet(@AuthUser User user, @PathVariable Long cardSetId) {
        return ApiResponse.onSuccess(ttsService.getTTSFileByCardSet(user, cardSetId));
    }

    @GetMapping("/cards/{cardId}")
    @Operation(summary = "카드별 TTS 파일 조회 API", description = "특정 카드에 대한 TTS 파일을 조회하는 API 입니다.")
    public ApiResponse<TTSResponse> getTTSFileByCard(@AuthUser User user, @PathVariable Long cardId) {
        return ApiResponse.onSuccess(ttsService.getTTSFileByCard(user, cardId));
    }
}
