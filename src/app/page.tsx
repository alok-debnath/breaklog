import Footer from '@/components/LandingPage/Footer';
import MobileHalo from '@/components/LandingPage/MobileHalo';
import MouseHalo from '@/components/LandingPage/MouseHalo';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <div className=''>
        <div className='bg-white text-black dark:bg-black dark:text-white'>
          <div className='min-w-screen mx-auto min-h-screen p-4'>
            <div className='mx-auto max-w-screen-xl px-1 md:px-10'>
              <MouseHalo />
              <MobileHalo />
              <nav className='start-0 top-0 z-20 mb-4 w-full bg-transparent'>
                <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4'>
                  <Link
                    href='/'
                    className='flex items-center space-x-3 rtl:space-x-reverse md:order-1'
                  >
                    {/* <img src="" className="h-8" alt="BreakLog Logo"/> */}
                    <span className='self-center whitespace-nowrap text-xl font-semibold'>
                      BreakLog
                    </span>
                  </Link>
                  <div className='flex space-x-3 rtl:space-x-reverse md:order-2 md:space-x-0'>
                    <Link
                      href='/login'
                      className='rounded-2xl bg-slate-100 px-5 py-2 text-center text-sm font-medium text-black hover:bg-slate-200'
                    >
                      Login
                    </Link>
                  </div>
                  <div
                    className='md:order-0 hidden w-full items-center justify-between md:flex md:w-auto'
                    id='navbar-sticky'
                  >
                    <ul className='mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium rtl:space-x-reverse md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0'>
                      <li>
                        <Link
                          href='https://www.alok01.eu.org/'
                          className='block rounded-2xl bg-transparent px-5 py-2 text-center text-sm font-medium text-black hover:bg-slate-100'
                        >
                          About
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <div className='my-8 grid min-h-screen grid-cols-12 md:my-14'>
                <div className='col-span-12 xl:col-span-8'>
                  <p className='text-4xl font-bold text-slate-300 md:text-6xl xl:text-7xl xl:font-extrabold'>
                    A better way
                  </p>
                  <p className='text-4xl font-bold md:text-6xl xl:text-7xl xl:font-extrabold'>
                    to manage your work hours
                  </p>
                  <p className='my-8 mr-10 text-xl font-medium md:my-10 md:mr-28 md:text-2xl'>
                    A project to log your work activities for better time
                    management.
                  </p>
                  <Link
                    href='/login'
                    className='text-md block w-fit rounded-3xl bg-sky-500 px-7 py-3 text-center font-medium text-white hover:bg-sky-600'
                  >
                    Try it now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
