"use client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { handleError } from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// import { sendEmail } from "@/helpers/mailer";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test("valid-email", "Invalid email address", (value) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    ),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, "Username must contain only letters and numbers")
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const initialValues = {
  email: "",
  username: "",
  password: "",
};
export default function SignupPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: {
    email: string;
    username: string;
    password: string;
  }) {
    try {
      const res = await axios.post("/api/auth/signup", values);

      // send email
      // await sendEmail({ email: values.email, emailType: "VERIFY", userID: res.data.data.id })
      if (res.data.success === true) {
        router.push("/login");
      }
    } catch (error: any) {
      if (error.response.data.error !== undefined) {
        handleError({
          error: { message: error.response.data.error },
          router: router,
        });
        if (error.response.data.focusOn.length > 0) {
          error.response.data.focusOn.forEach((field: string) => {
            formik.setFieldError(field, `Change ${field}`);
          });
        }
      } else {
        handleError({ error: error, router: null });
      }
    } finally {
      formik.setSubmitting(false);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="username" className="text-foreground/90 font-medium">
            Username
          </Label>
          <Input
            type="text"
            placeholder="johndoe"
            id="username"
            name="username"
            value={formik.values.username.toLowerCase()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="bg-background/50 border-border/50 hover:bg-background/70 focus:bg-background/80 h-12 rounded-xl backdrop-blur-sm transition-all duration-300"
          />
          {formik.touched.username && formik.errors.username && (
            <div className="mt-1 text-sm text-red-500">
              {formik.errors.username}
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
          className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 mt-4 h-12 w-full rounded-xl bg-gradient-to-r py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
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
