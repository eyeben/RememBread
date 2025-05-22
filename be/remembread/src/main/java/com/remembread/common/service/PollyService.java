package com.remembread.common.service;

import com.amazonaws.services.polly.AmazonPolly;
import com.amazonaws.services.polly.AmazonPollyClientBuilder;
import com.amazonaws.services.polly.model.OutputFormat;
import com.amazonaws.services.polly.model.SynthesizeSpeechRequest;
import com.amazonaws.services.polly.model.SynthesizeSpeechResult;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class PollyService {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String synthesizeAndUpload(String textType, String text, String voiceId, String s3Key) {
        // Polly 클라이언트 생성 (권한은 S3Config와 동일한 기본 자격 사용)
        AmazonPolly polly = AmazonPollyClientBuilder.standard()
                .withRegion(region)
                .build();

        // 음성 합성 요청
        SynthesizeSpeechRequest request = new SynthesizeSpeechRequest()
                .withTextType(textType)
                .withText(text)
                .withVoiceId(voiceId) // 예: "Seoyeon"
                .withOutputFormat(OutputFormat.Mp3)
                .withEngine("standard");

        SynthesizeSpeechResult result = polly.synthesizeSpeech(request);
        InputStream audioStream = result.getAudioStream();

        // 메타데이터 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("audio/mpeg");

        // 업로드
        amazonS3Client.putObject(bucket, s3Key, audioStream, metadata);

        // URL 반환 (Public 읽기 설정이 되어 있어야 바로 접근 가능)
        return amazonS3Client.getUrl(bucket, s3Key).toString();
    }
}
