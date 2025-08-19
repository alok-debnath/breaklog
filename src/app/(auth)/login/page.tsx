'use client';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { signIn } from 'next-auth/react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <Tabs defaultValue='traditional' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='traditional'>Traditional</TabsTrigger>
        <TabsTrigger value='oauth'>OAuth</TabsTrigger>
      </TabsList>
      <TabsContent value='traditional' className='animate-enter pt-4'>
        <form onSubmit={formik.handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                type='email'
                placeholder='name@example.com'
                id='email'
                name='email'
                value={formik.values.email.toLowerCase()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='text-sm text-red-500'>
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                type='password'
                placeholder='Password'
                id='password'
                name='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='text-sm text-red-500'>
                  {formik.errors.password}
                </div>
              )}
            </div>
            <Button
              type='submit'
              disabled={!formik.isValid || formik.isSubmitting}
              className='mt-2 w-full'
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </TabsContent>
      <TabsContent value='oauth' className='animate-enter pt-4'>
        <div className='py-4'>
          <GoogleSignInButton text='Sign in with Google' />
        </div>
      </TabsContent>
    </Tabs>
  );
}
