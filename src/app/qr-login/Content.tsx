'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

export const Content = () => {
  const { mutate } = useMutation({
    mutationFn: async () => await Promise.resolve(),
    onSuccess: () => {},
  });

  useEffect(() => mutate(), []);
  return null;
};
