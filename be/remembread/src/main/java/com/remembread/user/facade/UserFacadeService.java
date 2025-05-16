package com.remembread.user.facade;

import com.remembread.card.service.CardService;
import com.remembread.card.service.CardSetService;
import com.remembread.user.dto.response.UserCharacterResponse;
import com.remembread.user.entity.User;
import com.remembread.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserFacadeService {
    private final UserService userService;
    private final CardSetService cardSetService;
    private final CardService cardService;

    public List<UserCharacterResponse> getUserCharacter(User user) {
        List<UserCharacterResponse> response = userService.getUserCharacter(user);
        for(UserCharacterResponse itm: response) {
            if(itm.getIsLocked() && checkLock(itm.getId(), user)) {
                itm.updateIsLock(false);
                userService.addUserCharacter(user, itm.getId());
            }

        }

        return response;
    }

    private Boolean checkLock(Long characterId, User user) {
        if (characterId == 3L) {
            return cardSetService.countCardSet(user) >= 3;
        }
        else if (characterId == 4L) {
            return cardService.countCard(user) >= 10;
        }
        else if (characterId == 5L) {
            return userService.isLocationAccept(user);
        }
        else if (characterId == 6L) {
            return userService.countMissionCharacter(user) >= 3;
        }
        return false;
    }
}
