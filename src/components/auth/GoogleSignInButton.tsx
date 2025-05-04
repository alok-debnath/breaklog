// components/auth/GoogleSignInButton.tsx
'use client';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function GoogleSignInButton({
  text = 'Sign in with Google',
}: {
  text?: string;
}) {
  return (
    <div className='mt-5'>
      <button
        type='button'
        className='btn btn-primary flex w-full items-center gap-2 rounded-full'
        onClick={() => signIn('google')}
      >
        <Image
          src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'
          alt='Google'
          width={20}
          height={20}
        />
        {text}
      </button>
    </div>
  );
}
