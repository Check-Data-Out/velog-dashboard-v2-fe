import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryProvider } from '@/app/components/Provider/QueryProvider';

export const renderWithQueryClient = (element: ReactElement): RenderResult =>
  render(<QueryProvider>{element}</QueryProvider>);
