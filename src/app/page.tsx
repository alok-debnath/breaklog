import Link from 'next/link';

const Home = () => {
  return (
    <>
      <div className='mx-auto min-w-screen min-h-screen p-4 text-black bg-white'>
        <div className='mx-auto max-w-screen-xl px-1 md:px-10'>
          <nav className='bg-transparent w-full z-20 top-0 start-0 mb-4'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
              <Link
                href='/'
                className='flex items-center space-x-3 rtl:space-x-reverse md:order-1'>
                {/* <img src="" className="h-8" alt="BreakLog Logo"/> */}
                <span className='self-center text-xl font-semibold whitespace-nowrap'>
                  BreakLog
                </span>
              </Link>
              <div className='flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse'>
                <Link
                  href='/login'
                  className='text-black bg-slate-100 hover:bg-slate-200 font-medium rounded-2xl text-sm px-5 py-2 text-center'>
                  Login
                </Link>
              </div>
              <div
                className='items-center justify-between hidden w-full md:flex md:w-auto md:order-0'
                id='navbar-sticky'>
                <ul className='flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white'>
                  <li>
                    <Link
                      href='#'
                      className='block text-black bg-transparent hover:bg-slate-100 font-medium rounded-2xl text-sm px-5 py-2 text-center'>
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className='grid grid-cols-12 mt-8 md:mt-14'>
            <div className='col-span-12 xl:col-span-8'>
              <p className='text-4xl md:text-6xl xl:text-7xl font-bold xl:font-extrabold text-slate-300'>
                A better way
              </p>
              <p className='text-4xl md:text-6xl xl:text-7xl font-bold xl:font-extrabold'>
                to manage your work hours
              </p>
              <p className='text-2xl font-medium my-8 md:my-10 mr-10 md:mr-28'>
                A project to log your work activities for better time management.
              </p>
              <Link
                href='/login'
                className='text-white bg-sky-500 hover:bg-sky-600 font-medium rounded-3xl text-md px-7 py-3 text-center'>
                Try it now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
