'use server';

import { createHmac, timingSafeEqual } from 'crypto';
import { unsubscribeNewsletter } from '@/lib/apis/user.request';
import { ENVS } from '@/lib/constants/env.constant';

function verifyJwtAndExtractSub(token: string): string {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const [headerB64, payloadB64, signatureB64] = parts;

  const expectedSig = createHmac('sha256', ENVS.NEWSLETTER_SECRET_KEY)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  const expectedBuf = Buffer.from(expectedSig);
  const actualBuf = Buffer.from(signatureB64);

  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    throw new Error('Invalid JWT signature');
  }

  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

  if (!payload.sub) throw new Error('Missing sub claim in JWT');

  return payload.sub as string;
}

export async function unsubscribeAction(token: string): Promise<{ success: boolean }> {
  const uuid = verifyJwtAndExtractSub(token);
  await unsubscribeNewsletter(uuid);
  return { success: true };
}
