package com.remembread.card.service;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;
import com.remembread.card.converter.CardConverter;
import com.remembread.card.entity.Card;
import com.remembread.card.entity.CardSet;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import com.remembread.common.service.PollyService;
import com.remembread.card.dto.response.TTSResponse;
import com.remembread.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

@Slf4j
@Service
@RequiredArgsConstructor
public class TTSService {

    private final PollyService pollyService;
    private final CardSetRepository cardSetRepository;
    private final CardRepository cardRepository;

    @Transactional
    public List<TTSResponse> getTTSFileByCardSet(User user, Long cardSetId) {
        CardSet cardSet = cardSetRepository.findById(cardSetId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if (cardSet.getUser() != user) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }

        List<Card> cardList = cardRepository.findByCardSetIdOrderByNumber(cardSetId);

        return cardList.stream()
                .map(card -> getTTSFileByCard(user, card.getId()))
                .toList();
    }

    @Transactional
    public TTSResponse getTTSFileByCard(User user, Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.CARD_NOT_FOUND));

        if (card.getCardSet().getUser() != user) {
            throw new GeneralException(ErrorStatus.CARD_FORBIDDEN);
        }

        if (card.getTtsFileUrl() == null) {
            String concept = enhanceSSML(card.getConcept());
            String description = enhanceSSML(card.getDescription());

            card.setTtsFileUrl(pollyService.synthesizeAndUpload(
                    "ssml",
                    "<speak><p><s>" + concept + "</s><break time=\"700ms\"/><s>" + description + "</s></p></speak>",
                    "Seoyeon",
                    "tts/" + cardId + "_" + card.getConcept() + ".mp3"
            ));
        }

        return CardConverter.toTTSResponse(card);
    }

    // 영어 발음을 위한 태그 추가
    public static String enhanceSSML(String inputText) {
        Pattern englishPattern = Pattern.compile("([a-zA-Z]+(?:\\s+[a-zA-Z]+)*)");
        Matcher matcher = englishPattern.matcher(inputText);

        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String word = matcher.group(1);
            matcher.appendReplacement(result, "<lang xml:lang=\"en-US\">" + word + "</lang>");
        }

        matcher.appendTail(result);
        return result.toString();
    }
}
