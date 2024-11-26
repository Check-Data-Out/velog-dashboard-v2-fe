'use client';

import { Button, Input } from '@/components';
import { useForm } from 'react-hook-form';
import cookie from 'js-cookie';

interface formVo {
  access_token: string;
  refresh_token: string;
}

async function fetchCurrentUser() {
  const url = '/graphql';
  const headers = {
    'content-type': 'application/json',
    cookie:
      'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWZkMjdhZTQtZTZkMi00OWQ3LWJjMDEtNGZmOTg2YmRkOGIyIiwiaWF0IjoxNzMyNDk2NDY1LCJleHAiOjE3MzI1ODI4NjUsImlzcyI6InZlbG9nLmlvIiwic3ViIjoiYWNjZXNzX3Rva2VuIn0.lATs_JP1jVAubwra_ZUobvkprk_Yph_EtOA0t7UpBCg;',
  };
  const body = JSON.stringify({
    query: `
      query currentUser {
        currentUser {
          id
          username
          email
          profile {
            id
            thumbnail
            display_name
            short_bio
            profile_links
          }
          user_meta {
            id
            email_notification
            email_promotion
          }
        }
      }
    `,
    variables: {},
  });

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<formVo>({ mode: 'onChange' });

  const onSubmit = (data: formVo) => {
    cookie.set('access_token', data.access_token);
    cookie.set('refresh_token', data.refresh_token);
    fetchCurrentUser();
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-fit h-fit flex flex-col gap-[30px] items-center p-[30px] bg-bg-2 rounded-[4px] shadow-[0_4px_16px_0_rgba(0,0,0,.04)]"
      >
        <h1 className="font-medium text-[32px] text-text-1">Velog Dashboard</h1>
        <Input
          size="large"
          placeholder="Access Token을 입력하세요"
          {...register('access_token', { required: true })}
        />
        <Input
          size="large"
          placeholder="Refresh Token을 입력하세요"
          {...register('refresh_token', { required: true })}
        />
        <Button size="large" form="big" type="submit" disabled={!isValid}>
          로그인
        </Button>
      </form>
    </div>
  );
}
