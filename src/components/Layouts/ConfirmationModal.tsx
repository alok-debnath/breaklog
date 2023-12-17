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
        className='modal modal-bottom sm:modal-middle'>
        <form
          method='dialog'
          className='modal-box bg-base-200 pt-0 px-0 pb-0'>
          <h3 className='font-bold text-lg text-center py-6'>
            {dialogModal.modal_head ? dialogModal.modal_head : 'Confirmation Dialog'}
          </h3>
          <div className='card px-5 pb-5 bg-base-100 rounded-t-'>
            <div className='card-body'>
              <p className='font-semibold'>{dialogModal.modal_body}</p>
            </div>
            <div className='modal-action'>
              {/* if there is a button in form, it will close the modal */}
              <div className='join w-full flex'>
                <span
                  className='btn join-item flex-1'
                  onClick={onConfirm}>
                  {dialogModal.modal_confirm_btn ? dialogModal.modal_confirm_btn : 'Confirm'}
                </span>
                <span
                  className='btn btn-primary join-item flex-1'
                  onClick={onCancel}>
                  {dialogModal.modal_cancel_btn ? dialogModal.modal_cancel_btn : 'Close'}
                </span>
              </div>
            </div>
          </div>
        </form>
        <form
          method='dialog'
          className='modal-backdrop'>
          <span onClick={onCancel}>close</span>
        </form>
      </dialog>
    </>
  );
};

export default ConfirmationModal;
