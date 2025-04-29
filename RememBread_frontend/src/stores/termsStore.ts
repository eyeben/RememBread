import { create } from 'zustand';

interface TermsState {
  checkboxes: {
    all: boolean;
    term1: boolean;
    term2: boolean;
    term3: boolean;
  };
  handleSingleCheck: (name: keyof Omit<TermsState['checkboxes'], 'all'>, checked: boolean) => void;
  handleAllCheck: (checked: boolean) => void;
  isAllTermsChecked: boolean;
}

const useTermsStore = create<TermsState>((set) => ({
  checkboxes: {
    all: false,
    term1: false,
    term2: false,
    term3: false,
  },
  isAllTermsChecked: false,

  handleSingleCheck: (name, checked) => 
    set((state) => {
      const newCheckboxes = {
        ...state.checkboxes,
        [name]: checked,
      };
      
      // 모든 필수 약관이 체크되었는지 확인
      const allChecked = newCheckboxes.term1 && newCheckboxes.term2 && newCheckboxes.term3;
      
      return {
        checkboxes: {
          ...newCheckboxes,
          all: allChecked,
        },
        isAllTermsChecked: allChecked,
      };
    }),

  handleAllCheck: (checked) =>
    set(() => ({
      checkboxes: {
        all: checked,
        term1: checked,
        term2: checked,
        term3: checked,
      },
      isAllTermsChecked: checked,
    })),
}));

export default useTermsStore; 