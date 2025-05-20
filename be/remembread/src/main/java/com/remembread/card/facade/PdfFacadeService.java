package com.remembread.card.facade;

import com.remembread.card.dto.response.CardResponse;
import com.remembread.card.service.TextService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.InputStream;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfFacadeService {

    private final TextService textService;

    public Flux<CardResponse> createCardListStream(MultipartFile file) {
        AtomicInteger globalIndex = new AtomicInteger(1);

        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true); // 위치 기준 정렬 추가
            String text = stripper.getText(document).trim();
            return textService.createCardListStream(text, globalIndex);

        } catch (Exception e) {
            throw new RuntimeException("PDF 텍스트 추출 실패", e);
        }
    }

    public Flux<CardResponse> createCardListStreamByPage(MultipartFile file, Integer startPage, Integer endPage) {
        AtomicInteger globalIndex = new AtomicInteger(1);

        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setStartPage(startPage);
            stripper.setEndPage(endPage);
            stripper.setSortByPosition(true); // 위치 기준 정렬 추가

            String text = stripper.getText(document).trim();
            return textService.createCardListStream(text, globalIndex);

        } catch (Exception e) {
            throw new RuntimeException("PDF 텍스트 추출 실패", e);
        }
    }

}
