import { useStore } from '@/stores/store';
import useConfirm from '@/hooks/useConfirm';
declare global {
  interface Window {
    confirmation_modal: {
      showModal: () => void;
      close: () => void;
    };
  }
}
interface ConfirmationModalProps {}

const ConfirmationModal: React.FC<ConfirmationModalProps> = () => {
  const { dialogModal } = useStore();
  const { onConfirm, onCancel } = useConfirm();

  return (
    <>
      <dialog
        id='confirmation_modal'
        className='modal modal-bottom sm:modal-middle'
      >
        <form method='dialog' className='modal-box bg-base-200 px-0 pb-0 pt-0'>
          <h3 className='py-6 text-center text-lg font-bold'>
            {dialogModal.modal_head || 'Confirmation Dialog'}
          </h3>
          <div className='rounded-t- card rounded-b-none bg-base-100 px-5 pb-5'>
            <div className='card-body'>
              <p className='font-semibold'>{dialogModal.modal_body}</p>
            </div>
            <div className='modal-action'>
              {/* if there is a button in form, it will close the modal */}
              <div className='join flex w-full'>
                <span className='btn join-item flex-1' onClick={onConfirm}>
                  {dialogModal.modal_confirm_btn || 'Confirm'}
                </span>
                <span
                  className='btn btn-primary join-item flex-1'
                  onClick={onCancel}
                >
                  {dialogModal.modal_cancel_btn || 'Close'}
                </span>
              </div>
            </div>
          </div>
        </form>
        <form method='dialog' className='modal-backdrop'>
          <span onClick={onCancel}>close</span>
        </form>
      </dialog>
    </>
  );
};

export default ConfirmationModal;
