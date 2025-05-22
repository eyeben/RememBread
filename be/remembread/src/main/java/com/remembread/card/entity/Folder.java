package com.remembread.card.entity;

import com.remembread.common.entity.BaseEntity;
import com.remembread.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name = "folders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Folder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "upper_folder_id")
    private Folder upperFolder;

    @OneToMany(mappedBy = "upperFolder", cascade = CascadeType.ALL)
    private List<Folder> subFolders;

    @Column(length = 25, nullable = false)
    private String name;

    public void updateName(String name) {
        this.name = name;
    }
}