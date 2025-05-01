// components/auth/GoogleSignInButton.tsx
'use client';
import { signIn } from 'next-auth/react';

export default function GoogleSignInButton({
  text = 'Sign in with Google',
}: {
  text?: string;
}) {
  return (
    <div className='mt-5'>
      <button
        type='button'
        className='btn btn-outline flex w-full items-center gap-2 rounded-full px-4 py-2'
        onClick={() => signIn('google')}
      >
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'
          alt='Google G'
          className='h-5 w-5'
        />
        {text}
      </button>
    </div>
  );
}
