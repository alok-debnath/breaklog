"use client";

import { useMutation } from "convex/react";
import { useFormik } from "formik";
import { Clock, Save, X } from "lucide-react";
import { DateTime } from "luxon";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { handleError } from "../../common/CommonCodeBlocks";

// ========== Types ==========
interface TimeFormValues {
  dateISO: string;
  hour: string;
  minute: string;
  period: "AM" | "PM";
}

interface TimeBounds {
  min: number;
  max: number;
}

interface TimeEditFormProps {
  closeModal: () => void;
  bounds: TimeBounds;
  initialValues: TimeFormValues;
  localTimeZone: string;
  workTimeZone: string;
  editLogMutation: ReturnType<
    typeof useMutation<typeof api.user.editLog.editLog>
  >;
}

// ========== Constants ==========
const BOUNDARY_BUFFER_MS = 60 * 1000; // keep at least one minute between logs

// ========== Utility Functions ==========
const formatDateTimeForZone = (ms: number, zone: string): string => {
  const dateTime = DateTime.fromMillis(ms).setZone(zone);
  if (!dateTime.isValid) return "--";
  return dateTime.toFormat("MMM dd, yyyy hh:mm a");
};

const formatRangeForZone = (
  bounds: TimeBounds | null,
  zone: string
): string | null => {
  if (!bounds) return null;
  const min = DateTime.fromMillis(bounds.min).setZone(zone);
  const max = DateTime.fromMillis(bounds.max).setZone(zone);
  if (!min.isValid || !max.isValid) return null;
  const sameDay = min.hasSame(max, "day");
  if (sameDay) {
    return `${min.toFormat("MMM dd, yyyy")} ${min.toFormat(
      "hh:mm a"
    )} - ${max.toFormat("hh:mm a")}`;
  }
  return `${min.toFormat("MMM dd, yyyy hh:mm a")} - ${max.toFormat(
    "MMM dd, yyyy hh:mm a"
  )}`;
};

const buildInitialValues = (
  millis: number,
  localTimeZone: string
): TimeFormValues => {
  const dateTime = DateTime.fromMillis(millis).setZone(localTimeZone);
  return {
    dateISO: dateTime.toISODate() ?? "",
    hour: dateTime.toFormat("hh"),
    minute: dateTime.toFormat("mm"),
    period: dateTime.toFormat("a") as "AM" | "PM",
  };
};

const buildCandidateMillis = (
  values: TimeFormValues,
  localTimeZone: string
): number | null => {
  const hourValue = Number(values.hour);
  const minuteValue = Number(values.minute);
  if (!values.dateISO || Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
    return null;
  }

  if (hourValue < 1 || hourValue > 12 || minuteValue < 0 || minuteValue > 59) {
    return null;
  }

  let hour24 = hourValue % 12;
  if (values.period === "PM") {
    hour24 += 12;
  }
  if (values.period === "AM" && hourValue === 12) {
    hour24 = 0;
  }

  const candidate = DateTime.fromISO(values.dateISO, {
    zone: localTimeZone,
  }).set({
    hour: hour24,
    minute: minuteValue,
    second: 0,
    millisecond: 0,
  });

  if (!candidate.isValid) return null;
  return candidate.toMillis();
};

const computeBounds = ({
  currentMillis,
  behindMillis,
  aheadMillis,
  workTimeZone,
}: {
  currentMillis: number;
  behindMillis: number | null;
  aheadMillis: number | null;
  workTimeZone: string;
}): TimeBounds | null => {
  const reference = DateTime.fromMillis(currentMillis).setZone(workTimeZone);
  if (!reference.isValid) return null;
  const startOfDay = reference.startOf("day").toMillis();
  const endOfDay = reference.endOf("day").toMillis();

  const minCandidate = behindMillis
    ? Math.max(behindMillis + BOUNDARY_BUFFER_MS, startOfDay)
    : startOfDay;
  const maxCandidate = aheadMillis
    ? Math.min(aheadMillis - BOUNDARY_BUFFER_MS, endOfDay)
    : endOfDay;

  if (minCandidate >= maxCandidate) {
    return null;
  }

  return { min: minCandidate, max: maxCandidate };
};

const createValidationSchema = (bounds: TimeBounds, localTimeZone: string) =>
  Yup.object({
    dateISO: Yup.string().required("Date is required"),
    hour: Yup.string()
      .matches(/^(?:0?[1-9]|1[0-2])$/, "Hour must be between 1 and 12")
      .required("Hour is required"),
    minute: Yup.string()
      .matches(/^(?:[0-5]?\d)$/, "Minute must be between 0 and 59")
      .required("Minute is required"),
    period: Yup.mixed<"AM" | "PM">()
      .oneOf(["AM", "PM"])
      .required("Select AM or PM"),
  }).test("within-bounds", function (values) {
    const candidate = buildCandidateMillis(
      values as TimeFormValues,
      localTimeZone
    );
    if (candidate === null) {
      return this.createError({
        message: "Enter a valid date and time",
        path: "hour",
      });
    }
    if (candidate < bounds.min || candidate > bounds.max) {
      const humanRange =
        formatRangeForZone(bounds, localTimeZone) ?? "the allowed window";
      return this.createError({
        message: `Time must be between ${humanRange}`,
        path: "hour",
      });
    }
    return true;
  });

// ========== Components ==========
const TimeInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  min?: number;
  max?: number;
  showErrorMessage?: boolean;
}> = ({
  id,
  label,
  value,
  onChange,
  error,
  min = 0,
  max = 59,
  showErrorMessage = true,
}) => (
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
        error &&
          "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
      )}
    />
    {showErrorMessage && error && (
      <p className="px-2 text-xs font-medium text-red-500">{error}</p>
    )}
  </div>
);

const DateSelector: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  error?: string;
  localTimeZone: string;
}> = ({ value, onChange, min, max, error, localTimeZone }) => (
  <div className="space-y-2">
    <Label
      htmlFor="dateISO"
      className="text-foreground flex items-center gap-2 text-sm font-semibold"
    >
      <div className="bg-primary h-2 w-2 rounded-full" />
      Date ({localTimeZone})
    </Label>
    <Input
      id="dateISO"
      name="dateISO"
      type="date"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className={cn(
        "border-border/50 from-background/50 to-muted/20 h-12 rounded-xl bg-linear-to-r text-sm transition-all duration-200",
        "focus:ring-primary/20 focus:border-primary/50 focus:ring-2",
        error &&
          "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
      )}
    />
    <p className="text-muted-foreground px-2 text-xs">
      Adjust if your work timezone spans multiple local dates.
    </p>
    {error && <p className="px-2 text-xs font-medium text-red-500">{error}</p>}
  </div>
);

const PeriodSelector: React.FC<{
  value: "AM" | "PM";
  onChange: (period: "AM" | "PM") => void;
  error?: string;
}> = ({ value, onChange, error }) => {
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
        <PeriodButton period="AM" />
        <PeriodButton period="PM" />
      </div>
      {error && (
        <p className="px-2 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

const TimeEditForm: React.FC<TimeEditFormProps> = ({
  closeModal,
  bounds,
  initialValues,
  localTimeZone,
  workTimeZone,
  editLogMutation,
}) => {
  const { loading, logEditStore } = useStore();
  const validationSchema = React.useMemo(
    () => createValidationSchema(bounds, localTimeZone),
    [bounds, localTimeZone]
  );

  const dateRangeLocal = React.useMemo(
    () => formatRangeForZone(bounds, localTimeZone),
    [bounds, localTimeZone]
  );
  const dateRangeWork = React.useMemo(
    () => formatRangeForZone(bounds, workTimeZone),
    [bounds, workTimeZone]
  );

  const minDateISO = React.useMemo(
    () =>
      DateTime.fromMillis(bounds.min).setZone(localTimeZone).toISODate() ??
      undefined,
    [bounds, localTimeZone]
  );

  const maxDateISO = React.useMemo(
    () =>
      DateTime.fromMillis(bounds.max).setZone(localTimeZone).toISODate() ??
      undefined,
    [bounds, localTimeZone]
  );

  const formik = useFormik<TimeFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        useStore.setState({ loading: true });
        const candidateMillis = buildCandidateMillis(values, localTimeZone);
        if (
          candidateMillis === null ||
          candidateMillis < bounds.min ||
          candidateMillis > bounds.max
        ) {
          throw new Error(
            "Selected time is outside the allowed editing window"
          );
        }

        await editLogMutation({
          logId: logEditStore.log_id,
          logDateTime: candidateMillis,
        });

        closeModal();
      } catch (error: unknown) {
        handleError({ error, router: null });
      } finally {
        useStore.setState({ loading: false });
      }
    },
  });

  const previewMillis = React.useMemo(
    () => buildCandidateMillis(formik.values, localTimeZone),
    [formik.values, localTimeZone]
  );

  const previewLocal = previewMillis
    ? formatDateTimeForZone(previewMillis, localTimeZone)
    : "--";
  const previewWork = previewMillis
    ? formatDateTimeForZone(previewMillis, workTimeZone)
    : "--";

  const sharedTimeRangeError = React.useMemo(() => {
    if (typeof formik.errors.hour !== "string") {
      return null;
    }
    return formik.errors.hour.startsWith("Time must be between")
      ? formik.errors.hour
      : null;
  }, [formik.errors.hour]);
  const hasSharedTimeRangeError = Boolean(sharedTimeRangeError);

  return (
    <form onSubmit={formik.handleSubmit} className="flex h-full flex-col gap-4">
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-4 pt-1">
          <DateSelector
            value={formik.values.dateISO}
            onChange={formik.handleChange}
            min={minDateISO}
            max={maxDateISO}
            error={formik.errors.dateISO}
            localTimeZone={localTimeZone}
          />

          <div className="grid grid-cols-2 gap-4">
            <TimeInput
              id="hour"
              label="Hour"
              value={formik.values.hour}
              onChange={formik.handleChange}
              error={formik.errors.hour}
              showErrorMessage={!hasSharedTimeRangeError}
              min={1}
              max={12}
            />
            <TimeInput
              id="minute"
              label="Minute"
              value={formik.values.minute}
              onChange={formik.handleChange}
              error={
                hasSharedTimeRangeError
                  ? sharedTimeRangeError ?? undefined
                  : formik.errors.minute
              }
              showErrorMessage={!hasSharedTimeRangeError}
              min={0}
              max={59}
            />
          </div>

          {hasSharedTimeRangeError && (
            <div className="px-2 text-xs font-medium text-red-500">
              {sharedTimeRangeError}
            </div>
          )}

          <PeriodSelector
            value={formik.values.period}
            onChange={(period) => formik.setFieldValue("period", period)}
            error={formik.errors.period}
          />
        </div>
      </ScrollArea>
      <hr className="border-border" />
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={closeModal}
          variant="outline"
          className="border-border/50 hover:bg-muted/50 h-12 rounded-xl font-semibold transition-all duration-200 flex-1 min-w-[150px]"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!formik.isValid || loading}
          className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-12 rounded-xl bg-linear-to-r font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 flex-1 min-w-[150px]"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {/* <div className="space-y-4">
        <div className="border-border/50 from-background/50 to-muted/20 space-y-1 rounded-2xl border bg-linear-to-br p-4 text-xs font-medium text-muted-foreground">
          <p className="text-foreground text-sm font-semibold">
            Allowed window
          </p>
          <p>
            Local ({localTimeZone}): {dateRangeLocal ?? "--"}
          </p>
          <p>
            Work ({workTimeZone}): {dateRangeWork ?? "--"}
          </p>
        </div>

        <div className="border-border/50 from-background/50 to-muted/20 space-y-1 rounded-2xl border bg-linear-to-br p-4 text-xs font-medium text-muted-foreground">
          <p className="text-foreground text-sm font-semibold">Preview</p>
          <p>Local: {previewLocal}</p>
          <p>
            {workTimeZone}: {previewWork}
          </p>
        </div>
      </div> */}
    </form>
  );
};

const ModalHeader: React.FC<{
  localRange: string | null;
  workRange: string | null;
  localTimeZone: string;
  workTimeZone: string;
}> = ({ localRange, workRange, localTimeZone, workTimeZone }) => (
  <div className="space-y-3 pb-2 text-center">
    <div className="from-primary/10 to-primary/5 border-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border bg-linear-to-br">
      <Clock className="text-primary h-6 w-6" />
    </div>
    <div className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
      Edit Time
    </div>
    <div className="from-muted/50 to-muted/30 border-muted-foreground/10 space-y-1 rounded-xl border bg-linear-to-r px-4 py-2 text-xs font-medium">
      <p>
        {/* Local ({localTimeZone}):  */}
        {localRange ?? "Unavailable"}
      </p>
      {/* <p>
        Work ({workTimeZone}): {workRange ?? "Unavailable"}
      </p> */}
    </div>
  </div>
);

// ========== Main Component ==========
const TimeEditModal: React.FC = () => {
  const { logEditStore, isTimeEditModalOpen, userData } = useStore();
  const editLogMutation = useMutation(api.user.editLog.editLog);

  const [initialValues, setInitialValues] =
    React.useState<TimeFormValues | null>(null);
  const [bounds, setBounds] = React.useState<TimeBounds | null>(null);
  const [boundsError, setBoundsError] = React.useState<string | null>(null);

  const localTimeZone = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );
  const workTimeZone = userData.default_time_zone || localTimeZone;

  React.useEffect(() => {
    if (!logEditStore.log_dateTime) {
      setInitialValues(null);
      setBounds(null);
      setBoundsError(null);
      return;
    }

    const currentMillis = logEditStore.log_dateTime.getTime();
    const behindMillis = logEditStore.log_dateTime_behind
      ? logEditStore.log_dateTime_behind.getTime()
      : null;
    const aheadMillis = logEditStore.log_dateTime_ahead
      ? logEditStore.log_dateTime_ahead.getTime()
      : null;

    setInitialValues(buildInitialValues(currentMillis, localTimeZone));
    const computedBounds = computeBounds({
      currentMillis,
      behindMillis,
      aheadMillis,
      workTimeZone,
    });

    if (!computedBounds) {
      setBounds(null);
      setBoundsError(
        "No editable window is available for this log. Adjust neighboring logs or your timezone settings and try again."
      );
    } else {
      setBounds(computedBounds);
      setBoundsError(null);
    }
  }, [logEditStore, localTimeZone, workTimeZone]);

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

  const localRangeDisplay = formatRangeForZone(bounds, localTimeZone);
  const workRangeDisplay = formatRangeForZone(bounds, workTimeZone);

  const formProps =
    bounds && initialValues
      ? {
          closeModal,
          bounds,
          initialValues,
          localTimeZone,
          workTimeZone,
          editLogMutation,
        }
      : null;

  const renderContent = () => {
    if (boundsError) {
      return (
        <div className="space-y-4 rounded-2xl border border-border/40 bg-card/30 p-4 text-sm text-muted-foreground">
          <p>{boundsError}</p>
          <Button onClick={closeModal} variant="secondary" className="w-full">
            Close
          </Button>
        </div>
      );
    }

    if (!formProps) {
      return (
        <div className="rounded-2xl border border-border/40 bg-card/30 p-4 text-sm text-muted-foreground">
          <p>Select a log entry to edit.</p>
        </div>
      );
    }

    return <TimeEditForm {...formProps} />;
  };

  return (
    <Dialog open={isTimeEditModalOpen} onOpenChange={closeModal}>
      <DialogContent className="from-background/95 to-background/80 flex max-h-[90vh] flex-col gap-0 rounded-3xl border-0 bg-linear-to-br shadow-2xl backdrop-blur-xl sm:max-w-lg">
        <DialogHeader className="pt-6 pb-2">
          <DialogTitle>
            <ModalHeader
              localRange={localRangeDisplay}
              workRange={workRangeDisplay}
              localTimeZone={localTimeZone}
              workTimeZone={workTimeZone}
            />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edit the time for your log entry within the available window.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-scroll pb-6">
          <div className="flex h-full flex-col rounded-2xl border border-border/40 bg-card/30 p-4">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEditModal;
