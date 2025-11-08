"use client";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import {
  handleError,
  handleSuccessToast,
} from "@/components/common/CommonCodeBlocks";
import BottomNavbar from "@/components/Layouts/BottomNavbar";
import LogsCard from "@/components/Layouts/LogsCard";
import TimeEditModal from "@/components/Layouts/Modals/TimeEditModal";
import { api } from "@/convex/_generated/api";
import useConfirm from "@/hooks/useConfirm";
import useOnScreen from "@/hooks/useOnScreen";
import { useStore } from "@/stores/store";

const Index = () => {
  const { workData, userData, initialPageLoadDone } = useStore();
  const router = useRouter();
  const { confirm } = useConfirm();
  const isClient = typeof window !== "undefined";
  const submitLogMutation = useMutation(api.user.submitLog.submitLog);

  const logEntry = async (value: string) => {
    if (!isClient || !initialPageLoadDone) return;
    try {
      if (value === "undo log") {
        const isConfirmed = await confirm({
          modal_body:
            "Your most recent log will be permanently deleted, proceed with caution.",
          modal_head: "Delete most recent log?",
          modal_confirm_btn: "Delete",
          modal_cancel_btn: "Cancel",
        });
        if (!isConfirmed) {
          useStore.setState(() => ({ loading: false }));
          return;
        }
      }

      useStore.setState(() => ({ loading: true }));
      const res = await submitLogMutation({ logtype: value });
      if (res.message !== "Log submitted successfully") {
        handleSuccessToast({
          message: res.message,
        });
      }
      useStore.setState(() => ({ loading: false }));
    } catch (error: unknown) {
      handleError({ error: error, router: router });
    }
  };

  const isWorkDone =
    workData.unformattedWorkDone >=
    (userData.daily_work_required || 0) * 3600000;

  const isWorkDoneSuccess = isWorkDone && Boolean(userData.daily_work_required);

  const [ref, isIntersecting] = useOnScreen(-100);

  return (
    <div className="from-background via-background/95 to-muted/20 bg-linear-to-br">
      <LogsCard
        isWorkDoneSuccess={isWorkDoneSuccess}
        isIntersecting={isIntersecting}
        showAccordion={true}
        logEntry={logEntry}
      />
      <div ref={ref}></div>
      <BottomNavbar logEntry={logEntry} isIntersecting={isIntersecting} />
      <TimeEditModal />
    </div>
  );
};

export default Index;
