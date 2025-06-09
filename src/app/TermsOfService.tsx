const TERMS_OF_SERVICE_URL = 'https://nuung.notion.site/terms-of-service';
const PRIVACY_POLICY_URL = 'https://nuung.notion.site/privacy-policy';

export const TermsOfService = () => {
  return (
    <div className="flex items-center justify-center px-2 py-1 absolute bottom-0 left-0 w-full gap-2">
      <a href={TERMS_OF_SERVICE_URL} className="text-TEXT-ALT text-[14px]">
        서비스 이용약관
      </a>
      <div className="w-[1px] h-[15px] bg-TEXT-ALT" />
      <a href={PRIVACY_POLICY_URL} className="text-TEXT-ALT text-[14px]">
        개인정보처리방침
      </a>
      <div className="w-[1px] h-[15px] bg-TEXT-ALT max-MBI:hidden" />
      <span className="text-TEXT-ALT text-[14px] max-MBI:hidden">
        해당 서비스를 사용하실 경우, 약관에 동의하는 것으로 간주합니다.
      </span>
    </div>
  );
};
