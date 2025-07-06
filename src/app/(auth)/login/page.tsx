'use client';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { signIn } from 'next-auth/react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .test('valid-email', 'Invalid email address', function (value) {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  interface FormValues {
    email: string;
    password: string;
  }

  async function handleSubmit(values: FormValues) {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!res) {
        handleError({
          error: { message: 'Unexpected error. Please try again' },
          router: router,
        });
      } else if (res.ok && !res.error) {
        router.push('/dashboard');
      } else {
        handleError({
          error: { message: res.error || 'Authentication failed' },
          router: router,
        });
      }
    } catch (error) {
      handleError({ error, router });
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.email && formik.errors.email ? "border-destructive" : ""}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-destructive">{formik.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.password && formik.errors.password ? "border-destructive" : ""}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-destructive">{formik.errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton text="Sign in with Google" />
    </div>
  );
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .test('valid-email', 'Invalid email address', function (value) {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const initialValues = {
  email: '',
  password: '',
};
export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  interface FormValues {
    email: string;
    password: string;
  }
  async function handleSubmit(values: FormValues) {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!res) {
        // signIn() failed unexpectedly (network or internal error)
        handleError({
          error: { message: 'Unexpected error. Please try again' },
          router: router,
        });
      } else if (res.ok && !res.error) {
        router.push('/dashboard');
      } else {
        // Invalid credentials or handled failure
        handleError({
          error: {
            message:
              //  res.error ||
              'Invalid credentials',
          },
          router: router,
        });
      }
    } catch (error: any) {
      console.error('SignIn exception:', error);
      handleError({
        error: { message: 'An unexpected error occurred' },
        router: router,
      });
    } finally {
      formik.setSubmitting(false);
    }
  }

  return (
    <>
      <div className='tabs tabs-box'>
        <input
          type='radio'
          name='my_tabs_3'
          className='tab'
          aria-label='Traditional login'
          defaultChecked
        />
        <div className='tab-content bg-base-100 border-base-300 rounded-lg p-6'>
          <form onSubmit={formik.handleSubmit}>
            <fieldset className='fieldset grid gap-y-3'>
              <div>
                <legend className='fieldset-legend'>email</legend>
                <input
                  type='email'
                  placeholder='email'
                  className={`input ${
                    formik.touched.email && formik.errors.email
                      ? 'input-error'
                      : ''
                  }`}
                  id='email'
                  name='email'
                  value={formik.values.email.toLowerCase()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='error text-red-500'>
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div>
                <legend className='fieldset-legend'>Password</legend>
                <input
                  type='password'
                  placeholder='password'
                  className={`input ${
                    formik.touched.password && formik.errors.password
                      ? 'input-error'
                      : ''
                  }`}
                  id='password'
                  name='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='error text-red-500'>
                    {formik.errors.password}
                  </div>
                )}
                {/* <div><a className="link link-hover">Forgot password?</a></div> */}
              </div>
              <button
                type='submit'
                className={`btn btn-primary mt-4 ${
                  !formik.isValid || formik.isSubmitting ? 'btn-disabled' : ''
                }`}
              >
                Sign in
                {formik.isSubmitting ? (
                  <span className='loading loading-spinner'></span>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75'
                    />
                  </svg>
                )}
              </button>
            </fieldset>
          </form>
        </div>

        <input
          type='radio'
          name='my_tabs_3'
          className='tab'
          aria-label='OAuth login'
        />
        <div className='tab-content bg-base-100 border-base-300 rounded-lg p-6'>
          <GoogleSignInButton text='Sign in with Google' />
        </div>
      </div>
    </>
  );
}
