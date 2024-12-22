import { captureRequestError } from '@sentry/nextjs';

export async function register() {
  const { NEXT_RUNTIME } = process.env;
  if (NEXT_RUNTIME === 'nodejs') await import('../sentry.server.config');
  if (NEXT_RUNTIME === 'edge') await import('../sentry.edge.config');
}

export const onRequestError = captureRequestError;
