'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useStore } from '@/stores/store';
import useConfirm from '@/hooks/useConfirm';
import Button from "@/components/UI/Button";

interface ConfirmationModalProps { }

const ConfirmationModal: React.FC<ConfirmationModalProps> = () => {
  const { dialogModal, isConfirmationDialogOpen } = useStore();
  const { onConfirm, onCancel } = useConfirm();

  return (
    <Dialog open={isConfirmationDialogOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogModal.modal_head || 'Confirmation Dialog'}</DialogTitle>
          <DialogDescription>
            {dialogModal.modal_body}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm} variant="default">{dialogModal.modal_confirm_btn || 'Confirm'}</Button>
          <Button onClick={onCancel} variant="outline">{dialogModal.modal_cancel_btn || 'Close'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
