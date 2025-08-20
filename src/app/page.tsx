import Footer from '@/components/LandingPage/Footer';
import MobileHalo from '@/components/LandingPage/MobileHalo';
import MouseHalo from '@/components/LandingPage/MouseHalo';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <div className='from-background via-background/95 to-background/90 min-h-screen bg-gradient-to-br'>
        <div className='via-primary/5 text-foreground bg-gradient-to-br from-transparent to-transparent'>
          <div className='mx-auto min-h-screen min-w-screen p-4'>
            <div className='mx-auto max-w-7xl px-1 md:px-10'>
              <MouseHalo />
              <MobileHalo />

              <nav className='start-0 top-0 z-20 mb-4 w-full bg-transparent'>
                <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4'>
                  <Link
                    href='/'
                    className='group flex items-center space-x-3 md:order-1 rtl:space-x-reverse'
                  >
                    <span className='from-primary to-primary/70 group-hover:from-primary/80 group-hover:to-primary/50 self-center bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent transition-all duration-300'>
                      BreakLog
                    </span>
                  </Link>
                  <div className='flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse'>
                    <Link
                      href='/login'
                      className='from-card/80 to-card/60 border-border/50 text-foreground hover:from-card/90 hover:to-card/70 hover:shadow-primary/10 rounded-2xl border bg-gradient-to-r px-6 py-3 text-center text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:shadow-lg'
                    >
                      Login
                    </Link>
                  </div>
                  <div
                    className='hidden w-full items-center justify-between md:order-0 md:flex md:w-auto'
                    id='navbar-sticky'
                  >
                    <ul className='mt-4 flex flex-col rounded-lg p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:p-0 rtl:space-x-reverse'>
                      <li>
                        <Link
                          href='https://www.alok01.eu.org/'
                          className='text-foreground hover:bg-card/50 block rounded-2xl bg-transparent px-6 py-3 text-center text-sm font-medium backdrop-blur-sm transition-all duration-300'
                        >
                          About
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>

              <div className='my-8 grid min-h-screen grid-cols-12 md:my-14'>
                <div className='col-span-12 space-y-8 xl:col-span-8'>
                  <div className='space-y-4'>
                    <p className='text-muted-foreground/60 text-4xl leading-tight font-bold md:text-6xl xl:text-7xl xl:font-extrabold'>
                      A better way
                    </p>
                    <p className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-6xl xl:text-7xl xl:font-extrabold'>
                      to manage your work hours
                    </p>
                  </div>
                  <p className='text-muted-foreground max-w-2xl text-xl leading-relaxed font-medium md:text-2xl'>
                    A project to log your work activities for better time
                    management and productivity tracking.
                  </p>
                  <Link
                    href='/login'
                    className='from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 inline-block rounded-2xl bg-gradient-to-r px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg'
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
