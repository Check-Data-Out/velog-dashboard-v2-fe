import { QueryClient } from '@tanstack/react-query';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
const newQueryClient = () => new QueryClient();

export const renderWithQueryClient = (element: ReactElement): RenderResult => {
  return render(
    <QueryClientProvider client={newQueryClient()}>
      {element}
    </QueryClientProvider>,
  );
};
