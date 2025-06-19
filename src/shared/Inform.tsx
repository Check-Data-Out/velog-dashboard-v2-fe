import { createContext, useContext, useEffect } from 'react';
import { ParentNotFoundError } from '@/errors';

const InformContext = createContext({ inside: true });

export const Inform = ({ children }: { children: React.ReactNode | boolean }) => {
  return (
    <InformContext.Provider value={{ inside: true }}>
      <div className="flex flex-col items-center gap-3">{children}</div>
    </InformContext.Provider>
  );
};

const InformTitle = ({ children }: { children: string | boolean }) => {
  const context = useContext(InformContext);

  useEffect(() => {
    if (!context) throw new ParentNotFoundError();
  }, []);

  return (
    <h1 className="text-TEXT-ALT text-TITLE-5 transition-all max-TBL:text-TITLE-5">{children}</h1>
  );
};

const InformContent = ({ children, suffix }: { children: string; suffix?: string }) => {
  const context = useContext(InformContext);

  useEffect(() => {
    if (!context) throw new ParentNotFoundError();
  }, []);

  return (
    <span className="text-TEXT-MAIN text-TITLE-1 max-TBL:text-TITLE-2 transition-all">
      {`${children}${suffix || ''}`}
    </span>
  );
};

const InformHorizontal = ({ children }: { children: React.ReactNode | boolean }) => {
  const context = useContext(InformContext);

  useEffect(() => {
    if (!context) throw new ParentNotFoundError();
  }, []);

  return <div className="flex gap-2 items-center">{children}</div>;
};

const InformHighlighted = ({ children, suffix }: { children: string; suffix?: string }) => {
  const context = useContext(InformContext);

  useEffect(() => {
    if (!context) throw new ParentNotFoundError();
  }, []);

  return (
    <span className="text-PRIMARY-SUB text-SUBTITLE-3 max-TBL:text-SUBTITLE-4">
      {`${children}${suffix || ''}`}
    </span>
  );
};

Inform.Title = InformTitle;
Inform.Content = InformContent;
Inform.Horizontal = InformHorizontal;
Inform.Highlighted = InformHighlighted;
