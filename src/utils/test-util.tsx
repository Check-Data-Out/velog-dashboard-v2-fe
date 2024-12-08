import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

const newQueryClient = () => new QueryClient();

export const renderWithQueryClient = (element: ReactElement): RenderResult => {
  return render(
    <QueryClientProvider client={newQueryClient()}>
      {element}
    </QueryClientProvider>,
  );
};
