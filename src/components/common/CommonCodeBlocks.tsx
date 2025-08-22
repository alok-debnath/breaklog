"use client";
import { toast } from "sonner";
import { useStore } from "@/stores/store";

const updateLoadingState = () => {
  useStore.setState(() => ({ loading: false }));
};

export const handleError = async ({
  error,
  router,
}: {
  error: any;
  router?: any;
}) => {
  if (error.name !== "AbortError") {
    updateLoadingState();
    if (error.response?.data.SessionError) {
      await router.push("/login");
      toast.error("Invalid Token");
    } else {
      toast.error(error.message);
    }
  }
};

export const handleSuccessToast = async ({ message }: { message: string }) => {
  toast.success(message);
};
