package com.remembread.card.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long card_set_id;
    private Integer number;
    private String concept;
    private String description;
    private Integer right_count;
    private Integer test_count;
    private Double retention_rate;
    private Double stability_factor;
    private LocalDateTime last_right_at;
    private String concept_url;
    private String description_url;

}
