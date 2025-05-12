import { create } from "zustand";

interface ProfileState {
  nickname: string;
  mainCharacterId: number;
  mainCharacterImageUrl: string;
  pushEnable: boolean;
  socialLoginType: string;
}

interface ProfileActions {
  setProfile: (profile: ProfileState) => void;
  resetProfile: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  nickname: "",
  mainCharacterId: 1,
  mainCharacterImageUrl: "",
  pushEnable: true,
  socialLoginType: ""
};

const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,
  setProfile: (profile) => set(profile),
  resetProfile: () => set(initialState)
}));

export default useProfileStore;