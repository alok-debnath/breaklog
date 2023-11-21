import ToggleButtonText from '../UI/ToggleButtonText';
import SelectboxText from '../UI/SelectboxText';
import { ThemeName } from '../../Constants/ThemeConstant';
import { useStore } from '@/stores/store';

const SettingsModal = () => {
  const { breaklogMode, logs, themeMode } = useStore();
  const isClient = typeof window !== 'undefined';

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    useStore.setState(() => ({ themeMode: event.target.value }));
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState(() => ({ breaklogMode: event.target.checked }));
  };

  return (
    <>
      <dialog
        id='setting_modal'
        className='modal modal-bottom sm:modal-middle backdrop-blur-sm'>
        <form
          method='dialog'
          className='modal-box'>
          {/* <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
          <h3 className='font-bold text-lg text-center'>Settings</h3>
          <div className='divider'></div>

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

          <div className='modal-action'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn'>Close</button>
          </div>
        </form>
        <form
          method='dialog'
          className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default SettingsModal;
