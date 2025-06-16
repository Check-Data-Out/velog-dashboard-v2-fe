import { URLS } from '@/constants';

export const TermsOfService = () => {
  return (
    <div className="flex items-center justify-center px-2 py-1 absolute bottom-0 left-0 w-full gap-2">
      <a href={URLS.TERMS_OF_SERVICE} className="text-TEXT-ALT text-ST5">
        서비스 이용약관
      </a>
      <div className="w-[1px] h-[15px] bg-TEXT-ALT" />
      <a href={URLS.PRIVACY_POLICY} className="text-TEXT-ALT text-ST5">
        개인정보처리방침
      </a>
    </div>
  );
};
