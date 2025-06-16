'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * **서버 액션**
 *
 * 현재 남아있는 유저 정보 캐싱 데이터를 초기화함.
 * NextJS Client-Side Cache 해결을 위해 제작됨.
 */

export async function revalidate() {
  revalidatePath('/', 'layout');
  redirect('/');
}
