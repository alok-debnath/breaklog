import { useStore } from '@/stores/store';

declare global {
  interface Window {
    confirmation_modal: {
      showModal: () => void;
      close: () => void;
    };
  }
}
interface ConfirmationModalProps {
  // fetchLogFunction: Function;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = () => {
  const { dialogModal } = useStore();
  const modalFunction = (value: string) => {
    switch (value) {
      case 'modal_close':
        window.confirmation_modal.close();
        useStore.setState(() => ({
          dialogModal: {
            modal_body: '',
            modal_head: '',
            modal_confirm_btn: '',
          },
        }));
        break;
      case 'modal_confirm':
        window.confirmation_modal.close();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <dialog
        id='confirmation_modal'
        className='modal modal-bottom sm:modal-middle'>
        <form
          method='dialog'
          className='modal-box bg-base-200 pt-0 px-0 pb-0'>
          <h3 className='font-bold text-lg text-center py-6'>Confirmation Dialog</h3>
          <div className='card px-5 pb-5 bg-base-100 rounded-t-'>
            <div className='card-body'>
              <p className='font-semibold'>{dialogModal.modal_body}</p>
            </div>
            <div className='modal-action'>
              {/* if there is a button in form, it will close the modal */}
              <div className='join w-full flex'>
                <span
                  className='btn join-item flex-1'
                  onClick={() => modalFunction('modal_confirm')}>
                  Confirm
                </span>
                <span
                  className='btn btn-primary join-item flex-1'
                  onClick={() => modalFunction('modal_close')}>
                  Close
                </span>
              </div>
            </div>
          </div>
        </form>
        <form
          method='dialog'
          className='modal-backdrop'>
          <span onClick={() => modalFunction('modal_close')}>close</span>
        </form>
      </dialog>
    </>
  );
};

export default ConfirmationModal;
