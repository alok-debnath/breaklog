"use client";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const { workData, userData, breaklogMode } = useStore();
  const router = useRouter();
  const { confirm } = useConfirm();
  const isClient = typeof window !== "undefined";
  const submitLogMutation = useMutation(api.user.submitLog.submitLog);

  // Store pending log entries if mutation is not ready
  const pendingLogRef = useRef<{ value: string; time: number } | null>(null);

  useEffect(() => {
    // If there is a pending log, trigger it once mutation is ready
    if (userData.username && pendingLogRef.current) {
      const { value, time } = pendingLogRef.current;
      pendingLogRef.current = null;

      let finalValue = value;
      if (["break log", "day log"].includes(value)) {
        finalValue = breaklogMode ? "break log" : "day log";
      }
      logEntry(finalValue, time);
    }
  }, [userData.username]);

  const logEntry = async (value: string, customLogTime?: number) => {
    if (isClient && !userData.username) {
      // Store the pending log entry if mutation is not ready
      pendingLogRef.current = { value, time: Date.now() };
      handleSuccessToast({
        message: "Offline, Log will be submitted automatically once online",
      });
      return;
    }
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
      const res = await submitLogMutation({ logtype: value, customLogTime });
      if (customLogTime || res.message !== "Log submitted successfully") {
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
