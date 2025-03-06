import Image from 'next/image';
export default async function Page() {
  return (
    <main className="w-full h-screen flex items-center justify-center flex-col gap-2">
      <div className="bg-BG-SUB flex-col w-fit h-fit px-[150px] max-MBI:px-[45px] py-[100px] max-MBI:py-[50px] flex items-center justify-center gap-[50px] rounded-[4px]">
        <div className="flex items-center gap-[30px] max-TBL:gap-[38px] max-MBI:gap-[15px]">
          <div className="transition-all w-[100px] h-[100px] max-MBI:w-[64px] max-MBI:h-[64px] relative">
            <Image layout="fill" src={'/favicon.png'} alt="" />
          </div>

          <h2 className="text-T1 max-TBL:text-T2 max-MBI:text-ST3 font-bold text-TEXT-MAIN">
            Velog Dashboard
          </h2>
        </div>

        <span className="text-T1 max-TBL:text-T2 max-MBI:text-ST3 font-semibold text-TEXT-MAIN">
          알 수 없는 오류가 발생했습니다.
        </span>
      </div>
    </main>
  );
}
