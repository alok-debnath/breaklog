'use client';
import Navbar from '@/components/Layouts/Navbar';
import SettingsModal from '@/components/Layouts/SettingsModal';
import { useStore } from '@/stores/store';
import { toast } from 'react-hot-toast';
import InitialFetch from '@/components/common/InitialFetch';

const ProfilePage = () => {
  const { themeMode } = useStore();

  return (
    <>
      <InitialFetch />
      <div data-theme={themeMode}>
        <Navbar />
        <div className='hero min-h-screen bg-base-200'>
          <div className='hero-content text-center'>
            <div className='max-w-md'>
              <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
                <form className='card-body grid gap-y-3 w-full max-w-xl'>
                  <h3 className='text-2xl font-bold text-left'>Update your data</h3>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='username'>
                      <span className='label-text'>Username</span>
                    </label>
                    <input
                      type='text'
                      id='username'
                      name='username'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-md'
                    />
                  </div>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='email'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-md'
                    />
                  </div>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='name'>
                      <span className='label-text'>Name (not required)</span>
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-md'
                    />
                  </div>
                  <div className='form-control mt-6'>
                    <button
                      type='submit'
                      className='btn btn-primary normal-case'>
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
