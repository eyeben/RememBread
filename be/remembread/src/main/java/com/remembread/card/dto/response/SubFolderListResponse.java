package com.remembread.card.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class SubFolderListResponse {
    private Integer total;
    private List<SubFolderResponse> subFolders;
}
