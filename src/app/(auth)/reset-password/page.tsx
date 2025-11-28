"use client";

import { ErrorMessage, Field, type FieldProps, Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import {
  handleError,
  handleSuccessToast,
} from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const requestValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const resetValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const requestInitialValues = { email: "" };
const resetInitialValues = { password: "", confirmPassword: "" };

type FeedbackState = { type: "success" | "error"; message: string } | null;

const buildRedirectUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/reset-password`;
  }
  const fallback = process.env.NEXT_PUBLIC_SITE_URL;
  return fallback ? `${fallback}/reset-password` : undefined;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const queryError = searchParams.get("error");
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const tokenErrorMessage = useMemo(() => {
    if (!queryError) {
      return null;
    }
    return queryError === "INVALID_TOKEN"
      ? "Reset link is invalid or has expired. Please request a new one."
      : "Unable to verify reset link. Request a new one to continue.";
  }, [queryError]);

  async function handleRequestSubmit(
    values: typeof requestInitialValues,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) {
    setFeedback(null);
    try {
      const response = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: buildRedirectUrl(),
      });

      if (response.error) {
        const message =
          response.error.message ?? "Unable to request password reset";
        await handleError({
          error: { message },
          router,
        });
        setFeedback({ type: "error", message });
        return;
      }

      await handleSuccessToast({
        message: "If an account exists, a reset link is on the way.",
      });
      setFeedback({
        type: "success",
        message:
          "If that email is registered, you'll receive a reset link shortly.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to request password reset";
      await handleError({
        error: { message },
        router,
      });
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(
    values: typeof resetInitialValues,
    { setSubmitting }: { setSubmitting: (value: boolean) => void }
  ) {
    setFeedback(null);
    try {
      if (!token) {
        throw new Error("Reset token is missing");
      }
      const response = await authClient.resetPassword({
        token,
        newPassword: values.password,
      });

      if (response.error) {
        const message = response.error.message ?? "Unable to reset password";
        await handleError({
          error: { message },
          router,
        });
        setFeedback({ type: "error", message });
        return;
      }

      await handleSuccessToast({
        message: "Password updated. You can sign in now.",
      });
      setFeedback({
        type: "success",
        message: "Password updated successfully. Redirecting to login...",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reset password";
      await handleError({
        error: { message },
        router,
      });
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-muted-foreground text-sm">
          {token
            ? "Choose a new password to regain access to your account."
            : "We'll email a reset link if the account exists."}
        </p>
      </div>

      {(feedback || tokenErrorMessage) && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            (feedback && feedback.type === "success") ||
            (!feedback && !tokenErrorMessage)
              ? "border-green-500/40 bg-green-500/5 text-green-600"
              : "border-red-500/40 bg-red-500/5 text-red-600"
          }`}
        >
          {feedback?.message ?? tokenErrorMessage}
        </div>
      )}

      {!token ? (
        <Formik
          initialValues={requestInitialValues}
          validationSchema={requestValidationSchema}
          onSubmit={handleRequestSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="space-y-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="reset-email"
                  className="text-foreground/90 font-medium"
                >
                  Email
                </Label>
                <Field name="email">
                  {({ field }: FieldProps<string>) => (
                    <Input
                      {...field}
                      id="reset-email"
                      type="email"
                      placeholder="name@example.com"
                      className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 h-12 w-full rounded-xl bg-linear-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Sending reset link..." : "Send reset link"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={resetInitialValues}
          validationSchema={resetValidationSchema}
          onSubmit={handleResetSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="new-password"
                    className="text-foreground/90 font-medium"
                  >
                    New password
                  </Label>
                  <Field name="password">
                    {({ field }: FieldProps<string>) => (
                      <Input
                        {...field}
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="confirm-password"
                    className="text-foreground/90 font-medium"
                  >
                    Confirm password
                  </Label>
                  <Field name="confirmPassword">
                    {({ field }: FieldProps<string>) => (
                      <Input
                        {...field}
                        id="confirm-password"
                        type="password"
                        placeholder="Re-enter new password"
                        className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 h-12 w-full rounded-xl bg-linear-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Updating password..." : "Update password"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
