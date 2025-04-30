package com.remembread.card.service;

import com.remembread.card.repository.CardSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardSetService {
    private final CardSetRepository cardSetRepository;
}
