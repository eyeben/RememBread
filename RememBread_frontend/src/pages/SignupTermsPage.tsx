import { useState } from "react";
import Button from "@/components/common/Button";
import welcomeCroissant from "@/assets/loginImages/웰컴크루아상.png";

const SignupTermsPage = () => {
  const [checkboxes, setCheckboxes] = useState({
    all: false,
    term1: false,
    term2: false,
    term3: false,
  });

  const handleAllCheck = (checked: boolean) => {
    setCheckboxes({
      all: checked,
      term1: checked,
      term2: checked,
      term3: checked,
    });
  };

  const handleSingleCheck = (name: keyof typeof checkboxes, checked: boolean) => {
    const newCheckboxes = {
      ...checkboxes,
      [name]: checked,
    };
    
    // 모든 필수 약관이 체크되었는지 확인
    const allChecked = newCheckboxes.term1 && newCheckboxes.term2 && newCheckboxes.term3;
    
    setCheckboxes({
      ...newCheckboxes,
      all: allChecked,
    });
  };

  const isAllTermsChecked = checkboxes.term1 && checkboxes.term2 && checkboxes.term3;

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-md text-center mt-20">
        <img 
          src={welcomeCroissant} 
          alt="웰컴 크로아상" 
          className="w-[200px] h-[200px] mx-auto mb-8"
        />
        <h1 className="text-2xl font-bold mb-1">암기빵이 처음이시군요</h1>
        <p className="text-2xl font-bold mb-16">
          <span className="text-primary-500">약관내용에</span>
          <span className="text-black"> 동의해주세요</span>
        </p>

        <div className="rounded-lg mb-28">
          <label className="flex items-center gap-2 mb-4 bg-neutral-50 rounded-lg">
            <input 
              type="checkbox" 
              className="relative w-5 h-5 rounded appearance-none bg-neutral-100 checked:bg-primary-500 checked:border-primary-500 after:content-['✓'] after:absolute after:text-white checked:after:text-white after:opacity-100 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
              checked={checkboxes.all}
              onChange={(e) => handleAllCheck(e.target.checked)}
            />
            <span className="text-lg">약관 전체 동의</span>
          </label>
          <div className="space-y-4 text-left">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="relative w-5 h-5 rounded appearance-none bg-neutral-100 checked:bg-primary-500 checked:border-primary-500 after:content-['✓'] after:absolute after:text-white checked:after:text-white after:opacity-100 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                  checked={checkboxes.term1}
                  onChange={(e) => handleSingleCheck('term1', e.target.checked)}
                />
                <span>암기빵 이용약관 동의(필수)</span>
              </div>
              <button className="text-neutral-400">&gt;</button>
            </label>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="relative w-5 h-5 rounded appearance-none bg-neutral-100 checked:bg-primary-500 checked:border-primary-500 after:content-['✓'] after:absolute after:text-white checked:after:text-white after:opacity-100 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                  checked={checkboxes.term2}
                  onChange={(e) => handleSingleCheck('term2', e.target.checked)}
                />
                <span>암기빵 이용약관 동의(필수)</span>
              </div>
              <button className="text-neutral-400">&gt;</button>
            </label>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="relative w-5 h-5 rounded appearance-none bg-neutral-100 checked:bg-primary-500 checked:border-primary-500 after:content-['✓'] after:absolute after:text-white checked:after:text-white after:opacity-100 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                  checked={checkboxes.term3}
                  onChange={(e) => handleSingleCheck('term3', e.target.checked)}
                />
                <span>암기빵 이용약관 동의(필수)</span>
              </div>
              <button className="text-neutral-400">&gt;</button>
            </label>
          </div>
        </div>

        <Button 
          variant={isAllTermsChecked ? "primary" : "primary-outline"}
          className="w-full py-3"
          disabled={!isAllTermsChecked}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default SignupTermsPage; 