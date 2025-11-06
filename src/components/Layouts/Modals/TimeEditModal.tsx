"use client";

import { useMutation } from "convex/react";
import { useFormik } from "formik";
import { Clock, Save, X } from "lucide-react";
import * as React from "react";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { api } from "@/convex/_generated/api";
import { handleError } from "../../common/CommonCodeBlocks";

// ========== Types ==========
interface TimeValue {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

interface TimeLimit {
  min: TimeValue;
  max: TimeValue;
}

interface TimeEditFormProps {
  closeModal: () => void;
  limit: TimeLimit;
  localTime: TimeValue;
  localTimeZone: string;
  editLogMutation: ReturnType<typeof useMutation<typeof api.user.editLog.editLog>>;
}

// ========== Constants ==========
const DEFAULT_TIME_LIMIT: TimeLimit = {
  min: { hour: 5, minute: 31, period: "AM" },
  max: { hour: 11, minute: 59, period: "PM" },
};

// ========== Utility Functions ==========
const parseTimeString = (timeString: string): TimeValue => {
  const [hour, minute, period] = timeString.split(/:|\s/);
  return {
    hour: Number(hour),
    minute: Number(minute),
    period: (period || "AM") as "AM" | "PM",
  };
};

const formatTimeDisplay = (time: TimeValue): string => {
  const formattedHour = time.hour.toString().padStart(2, "0");
  const formattedMinute = time.minute.toString().padStart(2, "0");
  return `${formattedHour}:${formattedMinute} ${time.period}`;
};

const convertToUTC = (
  time: TimeValue,
  originalDateTime: Date,
  localTimeZone: string
): number => {
  const formattedOriginalDateTime = originalDateTime.toLocaleString("en-US", {
    timeZone: localTimeZone,
  });

  const localDateTime = new Date(formattedOriginalDateTime);
  localDateTime.setMinutes(time.minute);

  let adjustedHour = time.hour;
  if (time.period === "PM" && time.hour < 12) {
    adjustedHour = time.hour + 12;
  } else if (time.period === "AM" && time.hour === 12) {
    adjustedHour = 0;
  }
  localDateTime.setHours(adjustedHour);

  if (localDateTime < originalDateTime) {
    localDateTime.setDate(originalDateTime.getDate());
  }

  return new Date(localDateTime.toISOString()).getTime();
};

const getValidationSchema = (limit: TimeLimit) => {
  return Yup.object({
    hour: Yup.number()
      .when(["period"], ([period], schema) => {
        const isSamePeriod = limit.min.period === limit.max.period;
        
        if (period === limit.min.period) {
          return isSamePeriod
            ? schema.min(limit.min.hour).max(limit.max.hour)
            : schema.min(limit.min.hour).max(12);
        } else if (period === limit.max.period) {
          return isSamePeriod
            ? schema.max(limit.max.hour).min(limit.min.hour)
            : schema.max(limit.max.hour).min(1);
        }
        return schema.min(1).max(12);
      })
      .required("Hour is required"),
    
    minute: Yup.number()
      .when(["hour", "period"], ([hour, period], schema) => {
        const isMinLimit = hour === limit.min.hour && period === limit.min.period;
        const isMaxLimit = hour === limit.max.hour && period === limit.max.period;
        const isSameHour = limit.min.hour === limit.max.hour;

        if (isMinLimit) {
          return isSameHour
            ? schema.min(limit.min.minute).max(limit.max.minute)
            : schema.min(limit.min.minute).max(59);
        } else if (isMaxLimit) {
          return isSameHour
            ? schema.max(limit.max.minute).min(limit.min.minute)
            : schema.max(limit.max.minute).min(0);
        }
        return schema.min(0).max(59);
      })
      .required("Minute is required"),
    
    period: Yup.string()
      .oneOf([limit.min.period, limit.max.period])
      .required("Period is required"),
  });
};

// ========== Components ==========
const TimeInput: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  min?: number;
  max?: number;
}> = ({ id, label, value, onChange, error, min = 0, max = 59 }) => (
  <div className="space-y-2">
    <Label
      htmlFor={id}
      className="text-foreground flex items-center gap-2 text-sm font-semibold"
    >
      <div className="bg-primary h-2 w-2 rounded-full" />
      {label}
    </Label>
    <Input
      id={id}
      name={id}
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className={cn(
        "border-border/50 from-background/50 to-muted/20 h-12 rounded-xl bg-linear-to-r font-mono text-lg transition-all duration-200",
        "focus:ring-primary/20 focus:border-primary/50 focus:ring-2",
        error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
      )}
    />
    {error && (
      <p className="px-2 text-xs font-medium text-red-500">{error}</p>
    )}
  </div>
);

const PeriodSelector: React.FC<{
  value: string;
  onChange: (period: "AM" | "PM") => void;
  limit: TimeLimit;
  error?: string;
}> = ({ value, onChange, limit, error }) => {
  const showBothPeriods =
    (limit.min.period === "AM" && limit.max.period === "PM") ||
    (limit.min.period === "PM" && limit.max.period === "AM");

  const PeriodButton = ({ period }: { period: "AM" | "PM" }) => (
    <Button
      type="button"
      variant={value === period ? "default" : "outline"}
      onClick={() => onChange(period)}
      className={cn(
        "h-12 flex-1 rounded-xl font-semibold transition-all duration-200",
        value === period
          ? "from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-linear-to-r shadow-lg"
          : "border-border/50 hover:bg-muted/50"
      )}
    >
      {period}
    </Button>
  );

  return (
    <div className="space-y-2">
      <Label className="text-foreground flex items-center gap-2 text-sm font-semibold">
        <div className="bg-primary h-2 w-2 rounded-full" />
        Period
      </Label>
      <div className="flex gap-2">
        {showBothPeriods ? (
          <>
            <PeriodButton period="AM" />
            <PeriodButton period="PM" />
          </>
        ) : (
          <PeriodButton period={limit.min.period} />
        )}
      </div>
      {error && <p className="px-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

const TimeEditForm: React.FC<TimeEditFormProps> = ({
  closeModal,
  limit,
  localTime,
  localTimeZone,
  editLogMutation,
}) => {
  const { loading, logEditStore } = useStore();

  const handleSubmit = async (values: TimeValue) => {
    try {
      useStore.setState({ loading: true });
      
      const originalDateTime = logEditStore.log_dateTime ? new Date(logEditStore.log_dateTime) : new Date();
      const logDateTime = convertToUTC(values, originalDateTime, localTimeZone);

      await editLogMutation({
        logId: logEditStore.log_id,
        logDateTime,
      });
      
      closeModal();
    } catch (error: unknown) {
      handleError({ error, router: null });
    } finally {
      useStore.setState({ loading: false });
    }
  };

  const formik = useFormik<TimeValue>({
    initialValues: localTime,
    validationSchema: getValidationSchema(limit),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <ScrollArea className="max-h-[60vh] px-4 md:max-h-none">
        <div className="space-y-4">
          <TimeInput
            id="hour"
            label="Hour"
            value={formik.values.hour}
            onChange={formik.handleChange}
            error={formik.errors.hour}
            min={1}
            max={12}
          />

          <TimeInput
            id="minute"
            label="Minute"
            value={formik.values.minute}
            onChange={formik.handleChange}
            error={formik.errors.minute}
            min={0}
            max={59}
          />

          <PeriodSelector
            value={formik.values.period}
            onChange={(period) => formik.setFieldValue("period", period)}
            limit={limit}
            error={formik.errors.period}
          />
        </div>
      </ScrollArea>

      <div className="flex gap-3 px-4 pt-2">
        <Button
          type="button"
          onClick={closeModal}
          variant="outline"
          className="border-border/50 hover:bg-muted/50 h-12 flex-1 rounded-xl font-semibold transition-all duration-200"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formik.isValid || loading}
          className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-12 flex-1 rounded-xl bg-linear-to-r font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

const ModalHeader: React.FC<{ limit: TimeLimit }> = ({ limit }) => (
  <div className="space-y-3 pb-2 text-center">
    <div className="from-primary/10 to-primary/5 border-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border bg-linear-to-br">
      <Clock className="text-primary h-6 w-6" />
    </div>
    <div className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
      Edit Time
    </div>
    <div className="from-muted/50 to-muted/30 border-muted-foreground/10 rounded-xl border bg-linear-to-r px-4 py-2 text-sm font-medium">
      {formatTimeDisplay(limit.min)} - {formatTimeDisplay(limit.max)}
    </div>
  </div>
);

// ========== Main Component ==========
const TimeEditModal: React.FC = () => {
  const { logEditStore, isTimeEditModalOpen } = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const editLogMutation = useMutation(api.user.editLog.editLog);
  
  const [localTime, setLocalTime] = React.useState<TimeValue>(
    DEFAULT_TIME_LIMIT.min
  );
  const [limit, setLimit] = React.useState<TimeLimit>(DEFAULT_TIME_LIMIT);

  const localTimeZone = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  React.useEffect(() => {
    if (!logEditStore.log_dateTime) return;

    const dateTime = new Date(logEditStore.log_dateTime);
    const timeString = dateTime.toLocaleString("en-US", {
      timeZone: localTimeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    setLocalTime(parseTimeString(timeString));

    const minLimit = logEditStore.log_dateTime_behind
      ? parseTimeString(
          new Date(logEditStore.log_dateTime_behind).toLocaleString("en-US", {
            timeZone: localTimeZone,
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        )
      : DEFAULT_TIME_LIMIT.min;

    const maxLimit = logEditStore.log_dateTime_ahead
      ? parseTimeString(
          new Date(logEditStore.log_dateTime_ahead).toLocaleString("en-US", {
            timeZone: localTimeZone,
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        )
      : DEFAULT_TIME_LIMIT.max;

    setLimit({ min: minLimit, max: maxLimit });
  }, [logEditStore, localTimeZone]);

  const closeModal = React.useCallback(() => {
    useStore.setState({
      isTimeEditModalOpen: false,
      logEditStore: {
        log_id: "",
        log_dateTime: null,
        log_dateTime_ahead: null,
        log_dateTime_behind: null,
      },
    });
  }, []);

  const formProps = {
    closeModal,
    limit,
    localTime,
    localTimeZone,
    editLogMutation,
  };

  if (isDesktop) {
    return (
      <Dialog open={isTimeEditModalOpen} onOpenChange={closeModal}>
        <DialogContent className="from-background/95 to-background/80 rounded-3xl border-0 bg-linear-to-br shadow-2xl backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <ModalHeader limit={limit} />
            </DialogTitle>
            <DialogDescription className="sr-only">
              Edit the time for your log entry between {formatTimeDisplay(limit.min)} and {formatTimeDisplay(limit.max)}
            </DialogDescription>
          </DialogHeader>
          <TimeEditForm {...formProps} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isTimeEditModalOpen} onOpenChange={closeModal}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>
            <ModalHeader limit={limit} />
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Edit the time for your log entry between {formatTimeDisplay(limit.min)} and {formatTimeDisplay(limit.max)}
          </DrawerDescription>
        </DrawerHeader>
        <TimeEditForm {...formProps} />
        <DrawerFooter className="pt-0" />
      </DrawerContent>
    </Drawer>
  );
};

export default TimeEditModal;