"use client";
import { ErrorMessage, Field, type FieldProps, Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { handleError } from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test("valid-email", "Invalid email address", (value) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
    ),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const initialValues: FormValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) {
    try {
      const res = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (res.data) {
        router.push("/dashboard");
      } else {
        handleError({
          error: { message: res.error?.message || "Invalid credentials" },
          router,
        });
      }
    } catch (error: unknown) {
      console.error("SignIn exception:", error);
      handleError({
        error: { message: "An unexpected error occurred" },
        router,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="traditional" className="w-full">
        <TabsList className="bg-card/50 border-border/50 grid w-full grid-cols-2 rounded-xl border p-0 backdrop-blur-sm">
          <TabsTrigger
            value="traditional"
            className="data-[state=active]:bg-background/80 rounded-lg transition-all duration-300 data-[state=active]:shadow-sm"
          >
            Traditional
          </TabsTrigger>
          <TabsTrigger
            value="oauth"
            className="data-[state=active]:bg-background/80 rounded-lg transition-all duration-300 data-[state=active]:shadow-sm"
          >
            OAuth
          </TabsTrigger>
        </TabsList>

        {/* Traditional Login */}
        <TabsContent value="traditional" className="animate-enter pt-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-6">
                <div className="grid gap-6">
                  {/* Email Field */}
                  <div className="grid w-full items-center gap-2">
                    <Label
                      htmlFor="email"
                      className="text-foreground/90 font-medium"
                    >
                      Email
                    </Label>
                    <Field name="email">
                      {({ field }: FieldProps<string>) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          id="email"
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

                  {/* Password Field */}
                  <div className="grid w-full items-center gap-2">
                    <Label
                      htmlFor="password"
                      className="text-foreground/90 font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Field name="password">
                        {({ field }: FieldProps<string>) => (
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            id="password"
                            className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300 pr-10"
                          />
                        )}
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 mt-4 h-12 w-full rounded-xl bg-linear-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </TabsContent>

        {/* OAuth Login */}
        <TabsContent value="oauth" className="animate-enter pt-6">
          <div className="py-4">
            <GoogleSignInButton text="Sign in with Google" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
