import ToggleButtonText from '../../ui/toggle-button-text';
import SelectboxText from '../../ui/selectbox-text';
import { ThemeName } from '../../../Constants/ThemeConstant';
import { useStore } from '@/stores/store';

declare global {
  interface Window {
    setting_modal: {
      showModal: () => void;
      // Add any other properties and methods here if necessary
    };
  }
}
const SettingsModal = () => {
  const { breaklogMode, logs, themeMode } = useStore();
  const isClient = typeof window !== 'undefined';

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    useStore.setState(() => ({ themeMode: event.target.value }));
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState(() => ({ breaklogMode: event.target.checked }));
    localStorage.setItem('breaklogMode', JSON.stringify(event.target.checked));
  };

  return (
    <>
      <dialog id='setting_modal' className='modal modal-bottom sm:modal-middle'>
        <form method='dialog' className='modal-box'>
          {/* <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
          <h3 className='text-center text-lg font-bold'>Settings</h3>
          <div className='divider'></div>
          <div className='grid grid-cols-1 gap-y-6'>
            <ToggleButtonText
              text='BreakLog mode'
              disabled={logs.length === 0 ? false : true}
              checked={breaklogMode}
              secondaryText='(LOP will be miscalculated once log is saved using this mode)'
              onChange={handleToggleChange}
            />
            <SelectboxText
              text='Theme'
              OptionValue={ThemeName}
              checked={themeMode}
              onChange={handleThemeChange}
            />
          </div>
          <div className='modal-action'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn'>Close</button>
          </div>
        </form>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default SettingsModal;
