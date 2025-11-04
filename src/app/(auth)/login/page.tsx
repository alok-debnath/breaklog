"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { handleError } from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test("valid-email", "Invalid email address", (value) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    ),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const initialValues = {
  email: "",
  password: "",
};
export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });
  interface FormValues {
    email: string;
    password: string;
  }
  async function handleSubmit(values: FormValues) {
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
          router: router,
        });
      }
    } catch (error: unknown) {
      console.error("SignIn exception:", error);
      handleError({
        error: { message: "An unexpected error occurred" },
        router: router,
      });
    } finally {
      formik.setSubmitting(false);
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

        <TabsContent value="traditional" className="animate-enter pt-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid w-full items-center gap-2">
                <Label
                  htmlFor="email"
                  className="text-foreground/90 font-medium"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  id="email"
                  name="email"
                  value={formik.values.email.toLowerCase()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="mt-1 text-sm text-red-500">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label
                  htmlFor="password"
                  className="text-foreground/90 font-medium"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="mt-1 text-sm text-red-500">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
                className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 mt-4 h-12 w-full rounded-xl bg-linear-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="oauth" className="animate-enter pt-6">
          <div className="py-4">
            <GoogleSignInButton text="Sign in with Google" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
