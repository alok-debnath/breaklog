'use client';
import { useStore } from '@/stores/store';

let resolveCallback: (value: boolean) => void;

type ConfirmOptions = {
  modal_body: string;
  modal_head: string;
  modal_confirm_btn: string;
  modal_cancel_btn: string;
};

function useConfirm() {
  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };
  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };
  const confirm = (values: ConfirmOptions) => {
    useStore.setState(() => ({
      dialogModal: {
        modal_body: values.modal_body,
        modal_head: values.modal_head,
        modal_confirm_btn: values.modal_confirm_btn,
        modal_cancel_btn: values.modal_cancel_btn,
      },
    }));

    window.confirmation_modal.showModal();
    return new Promise((resolve, reject) => {
      resolveCallback = resolve;
    });
  };

  const closeConfirm = () => {
    window.confirmation_modal.close();
    useStore.setState(() => ({
      dialogModal: {
        modal_body: '',
        modal_head: '',
        modal_confirm_btn: '',
        modal_cancel_btn: '',
      },
    }));
  };

  return { confirm, onConfirm, onCancel };
}

export default useConfirm;
