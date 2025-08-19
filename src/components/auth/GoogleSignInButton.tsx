// components/auth/GoogleSignInButton.tsx
'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function GoogleSignInButton({
  text = 'Sign in with Google',
}: {
  text?: string;
}) {
  return (
    <div className='mt-5'>
      <Button
        variant='secondary'
        className='w-full'
        onClick={() => signIn('google')}
      >
        <Image
          src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'
          alt='Google'
          width={20}
          height={20}
          className='mr-2'
        />
        {text}
      </Button>
    </div>
  );
}
