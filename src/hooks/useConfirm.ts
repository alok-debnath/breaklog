'use client';
import { useStore } from '@/stores/store';

let resolveCallback: (value: boolean) => void;

function useConfirm() {
  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };
  const confirm = () => {
    window.confirmation_modal.showModal();
    return new Promise((res) => {
      resolveCallback = res;
    });
  };

  const closeConfirm = () => {
    window.confirmation_modal.close();
    useStore.setState(() => ({
      dialogModal: {
        modal_body: '',
        modal_head: '',
        modal_confirm_btn: '',
      },
    }));
  };

  return { confirm, onConfirm, onCancel };
}

export default useConfirm;
