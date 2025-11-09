"use client";
import { useFormik } from "formik";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import {
  handleError,
  handleSuccessToast,
} from "@/components/common/CommonCodeBlocks";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string(),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const PasswordChangeForm = ({ className }: { className?: string }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: handlePasswordSubmit,
  });

  async function handlePasswordSubmit(values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    setIsChangingPassword(true);
    try {
      const res = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: false,
      });

      if (res.error) {
        handleError({
          error: { message: res.error.message || "Failed to change password" },
          router: null,
        });
      } else {
        handleSuccessToast({
          message: "Password changed successfully",
        });
        formik.resetForm();
        // Close the modal after successful password change
        useStore.setState({ isPasswordChangeModalOpen: false });
      }
    } catch (error: unknown) {
      handleError({ error, router: null });
    } finally {
      setIsChangingPassword(false);
      formik.setSubmitting(false);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className={cn("grid gap-6 py-6", className)}>
      {/* Current Password */}
      <div className="grid w-full items-center gap-2">
        <Label
          htmlFor="currentPassword"
          className="text-foreground/90 font-medium"
        >
          Current Password
        </Label>
        <div className="relative">
          <Input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter current password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 rounded-xl pr-10 backdrop-blur-sm transition-all duration-300"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <div className="error my-1 text-start text-sm text-red-500">
            {formik.errors.currentPassword}
          </div>
        )}
      </div>

      {/* New Password */}
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="newPassword" className="text-foreground/90 font-medium">
          New Password
        </Label>
        <div className="relative">
          <Input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 rounded-xl pr-10 backdrop-blur-sm transition-all duration-300"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className="error my-1 text-start text-sm text-red-500">
            {formik.errors.newPassword}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="grid w-full items-center gap-2">
        <Label
          htmlFor="confirmPassword"
          className="text-foreground/90 font-medium"
        >
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 rounded-xl pr-10 backdrop-blur-sm transition-all duration-300"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="error my-1 text-start text-sm text-red-500">
            {formik.errors.confirmPassword}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isChangingPassword || !formik.isValid}
        className="from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-primary-foreground hover:shadow-red-500/25 mt-2 rounded-xl bg-linear-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
      >
        {isChangingPassword ? (
          <div className="flex items-center gap-2">
            <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
            Changing Password...
          </div>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
};

const PasswordChangeModal = () => {
  const { isPasswordChangeModalOpen } = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onOpenChange = (isOpen: boolean) => {
    useStore.setState({ isPasswordChangeModalOpen: isOpen });
  };

  if (isDesktop) {
    return (
      <Dialog open={isPasswordChangeModalOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-background/80 border-border/50 shadow-2xl backdrop-blur-xl sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-red-500/20 to-orange-500/20 p-2 backdrop-blur-sm">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-semibold">
                Change Password
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>
          <PasswordChangeForm />
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isPasswordChangeModalOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-red-500/20 to-orange-500/20 p-2 backdrop-blur-sm">
              <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DrawerTitleComponent className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-semibold">
              Change Password
            </DrawerTitleComponent>
          </div>
          <DrawerDescriptionComponent className="text-muted-foreground">
            Update your password to keep your account secure.
          </DrawerDescriptionComponent>
        </DrawerHeader>
        <PasswordChangeForm className="px-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PasswordChangeModal;
