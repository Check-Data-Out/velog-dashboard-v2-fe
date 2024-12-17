import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { QueryProvider } from '@/components';

export const renderWithQueryClient = (element: ReactElement): RenderResult => {
  return render(<QueryProvider>{element}</QueryProvider>);
};
