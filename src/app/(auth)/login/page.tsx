'use client';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { signIn } from 'next-auth/react';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import Button from '@/components/UI/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      <Tabs defaultValue="traditional" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="traditional">Traditional</TabsTrigger>
          <TabsTrigger value="oauth">OAuth</TabsTrigger>
        </TabsList>
        <TabsContent value="traditional">
          <form onSubmit={formik.handleSubmit}>
            <fieldset className='fieldset grid gap-y-3'>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type='email'
                  placeholder='email'
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
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type='password'
                  placeholder='password'
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
              <Button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
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
              </Button>
            </fieldset>
          </form>
        </TabsContent>
        <TabsContent value="oauth">
          <GoogleSignInButton text='Sign in with Google' />
        </TabsContent>
      </Tabs>
    </>
  );
}
