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

@Slf4j
@Service
@RequiredArgsConstructor
public class TTSService {

    private final PollyService pollyService;
    private final CardSetRepository cardSetRepository;
    private final CardRepository cardRepository;

    @Transactional
    public List<TTSResponse> getTTSFile(User user, Long cardSetId) {
        CardSet cardSet = cardSetRepository.findById(cardSetId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.CARDSET_NOT_FOUND));

        if (cardSet.getUser() != user) {
            throw new GeneralException(ErrorStatus.CARDSET_FORBIDDEN);
        }

        List<Card> cardList = cardRepository.findByCardSetIdOrderByNumber(cardSetId);

        for (Card card : cardList) {
            if (card.getTtsFileUrl() == null) {
                card.setTtsFileUrl(pollyService.synthesizeAndUpload(
                        "ssml",
                        "<speak><p><s>" + card.getConcept() + "</s><break time=\"700ms\"/><s>" + card.getDescription() + "</s></p></speak>",
                        "Seoyeon",
                        "tts/" + cardSetId + "_" + card.getId() + "_" + card.getConcept() + ".mp3"
                ));
            }
        }

        return cardList.stream()
                .map(CardConverter::toTTSResponse)
                .toList();
    }
}
