package com.remembread.card.service;

import com.remembread.apipayload.ApiResponse;
import com.remembread.card.dto.request.CardCreateGetDto;
import com.remembread.card.repository.CardRepository;
import com.remembread.card.repository.CardSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardService {
    private final CardRepository cardRepository;
    private final CardSetRepository cardSetRepository;

    public void createCard(CardCreateGetDto request, Long userId) {
        if(cardSetRepository.getCardSetById(request.))
    }
}
