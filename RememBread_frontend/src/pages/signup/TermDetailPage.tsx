import { useNavigate, useParams } from 'react-router-dom';

const TermDetailPage = () => {
  const navigate = useNavigate();
  const { termId } = useParams();

  const termContents = {
    1: {
      title: '세부 동의 사항',
      content: `제 1조 (목적)
이 약관은 주식회사 "암기빵"(이하 "회사"라 합니다)이 제공하는 암기빵 서비스(이하 "서비스"라 합니다)와 관련하여, 회사 이용 과정에서 서비스 이용자와 회사 간의 권리, 의무 및 책임사항의 규정을 목적으로 합니다. 본 약관은 PC통신, 스마트폰(안드로이드 등, 아이폰 등) 앱 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 준용됩니다.

제 2조 (용어의 정의)
1. "서비스"란 "회사"가 제공 또는서비스 상품(이하 "제품 등")이나 관련서비스를 "이용자"가 컴퓨터 등 정보통신설비를 이용하여 제품 등을 거래할 수 있도록 설정하여 제공하는 가상의 영업장을 말합니다.

2. "회사"가 제공 하는 "암기빵"에 게시정보를 제공하여 회원 등록을 한 자로서, "암기빵"의 정보를 지속적으로 제공받으며, "암기빵"이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미하고, "암기빵" 광고업소는 포함되지 않습니다.

제 3조 (아이우에오)`
    },
    2: {
      title: '개인정보 처리방침',
      content: '개인정보 처리방침 내용이 들어갈 자리입니다...'
    },
    3: {
      title: '위치기반 서비스 이용약관',
      content: '위치기반 서비스 이용약관 내용이 들어갈 자리입니다...'
    }
  };

  const currentTerm = termContents[Number(termId) as keyof typeof termContents];

  const handleAgree = () => {
    navigate('/signup');
  };

  const handleBack = () => {
    navigate('/signup/terms');
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-50">
        <nav className="h-full mx-auto">
          <div className="flex items-center w-full h-full px-5">
            <button 
              onClick={handleBack}
              className="absolute left-5"
            >
              &lt;
            </button>
            <h1 className="w-full text-center text-lg font-bold">
              {currentTerm?.title}
            </h1>
          </div>
        </nav>
      </header>
      <div className="pt-14">
        <div className="p-6">
          <p className="whitespace-pre-line text-sm leading-6">
            {currentTerm?.content}
          </p>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-[600px] mx-auto p-4 bg-white border-t border-neutral-200">
        <button 
          onClick={handleAgree}
          className="w-full py-3 bg-primary text-white rounded-lg"
        >
          동의
        </button>
      </div>
    </div>
  );
};

export default TermDetailPage; 