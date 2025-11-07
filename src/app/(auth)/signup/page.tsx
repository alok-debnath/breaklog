"use client";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { handleError } from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

// import { sendEmail } from "@/helpers/mailer";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test("valid-email", "Invalid email address", (value) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    ),
  name: Yup.string()
    .matches(/^[a-zA-Z ]*$/, "Name must contain only letters")
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name must be at most 10 characters")
    .required("Name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const initialValues = {
  email: "",
  name: "",
  password: "",
};
export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: {
    email: string;
    name: string;
    password: string;
  }) {
    try {
      const res = await authClient.signUp.email({
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim(),
      });

      if (res.data) {
        router.push("/login");
      } else {
        handleError({
          error: { message: res.error?.message || "Signup failed" },
          router: router,
        });
      }
    } catch (error: unknown) {
      handleError({ error: error, router: null });
    } finally {
      formik.setSubmitting(false);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="name" className="text-foreground/90 font-medium">
            name
          </Label>
          <Input
            type="text"
            placeholder="john doe"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="mt-1 text-sm text-red-500">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="email" className="text-foreground/90 font-medium">
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
          <Label htmlFor="password" className="text-foreground/90 font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              name="password"
              value={formik.values.password.trim()}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300 pr-10"
            />
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
              Signing up...
            </div>
          ) : (
            "Sign up"
          )}
        </Button>
      </div>
    </form>
  );
}
