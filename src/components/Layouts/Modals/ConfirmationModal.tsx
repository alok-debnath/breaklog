"use client";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription as DrawerDescriptionComponent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle as DrawerTitleComponent,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import useConfirm from "@/hooks/useConfirm";
import { useStore } from "@/stores/store";

const ConfirmationModal: React.FC = () => {
  const { dialogModal, isConfirmationDialogOpen } = useStore();
  const { onConfirm, onCancel } = useConfirm();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isConfirmationDialogOpen} onOpenChange={onCancel}>
        <DialogContent className="bg-background/80 border-border/50 shadow-2xl backdrop-blur-xl sm:max-w-[450px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-orange-500/20 to-red-500/20 p-2 backdrop-blur-sm">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <DialogTitle className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-semibold">
                {dialogModal.modal_head || "Confirmation Dialog"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground pl-10 leading-relaxed">
              {dialogModal.modal_body}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-3 pt-6">
            <Button
              onClick={onCancel}
              variant="outline"
              className="bg-background/50 border-border/50 hover:bg-background/70 rounded-xl px-6 backdrop-blur-sm transition-all duration-300"
            >
              {dialogModal.modal_cancel_btn || "Close"}
            </Button>
            <Button
              onClick={onConfirm}
              className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 rounded-xl bg-linear-to-r px-6 font-medium transition-all duration-300 hover:shadow-lg"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {dialogModal.modal_confirm_btn || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isConfirmationDialogOpen} onOpenChange={onCancel}>
      <DrawerContent>
        <DrawerHeader className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-orange-500/20 to-red-500/20 p-2 backdrop-blur-sm">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <DrawerTitleComponent className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-semibold">
              {dialogModal.modal_head || "Confirmation Dialog"}
            </DrawerTitleComponent>
          </div>
          <DrawerDescriptionComponent className="text-muted-foreground pl-10 leading-relaxed">
            {dialogModal.modal_body}
          </DrawerDescriptionComponent>
        </DrawerHeader>

        <DrawerFooter className="gap-3 pt-6">
          <Button
            onClick={onConfirm}
            className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 rounded-xl bg-linear-to-r px-6 font-medium transition-all duration-300 hover:shadow-lg"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {dialogModal.modal_confirm_btn || "Confirm"}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="bg-background/50 border-border/50 hover:bg-background/70 rounded-xl px-6 backdrop-blur-sm transition-all duration-300"
            >
              {dialogModal.modal_cancel_btn || "Close"}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmationModal;
