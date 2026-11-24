
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/EDUNOVA VERTICAL.webp";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { hodLogin, setSession } from "../lib/api";

type FormErrors = {
  email?: string;
  password?: string;
};

const validateEmail = (email: string): string => {
  const value = email.trim();

  if (!value) return "Please enter your departmental email address.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};

const validatePassword = (password: string): string => {
  if (!password) return "Please enter your password.";

  if (password.length < 6) {
    return "Your password must contain at least 6 characters.";
  }

  return "";
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const updateField = (field: "email" | "password", value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitError("");

  if (!validateForm()) return;

  try {
    setLoading(true);

    const response = await hodLogin({
      email: form.email.trim(),
      password: form.password,
    });

    console.log("HOD LOGIN RESPONSE:", response);

    const accessToken = response?.data?.access_token;
    const refreshToken = response?.data?.refresh_token;

    if (!response?.success || !accessToken || !refreshToken) {
      throw new Error(
        response?.message || "Login response did not contain valid tokens."
      );
    }

    setSession(accessToken, "hod", refreshToken);

    const destination =
      location.state?.from?.pathname || "/";

    navigate(destination, { replace: true });

  } catch (err) {
    console.error("HOD LOGIN ERROR:", err);

    setSubmitError(
      err instanceof Error
        ? err.message
        : "Unable to sign in. Please check your details and try again."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20  items-center justify-center  text-[#B8901F]">
              <img src={logo} alt="Edunova Logo" className="h-20 w-auto"  />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to your EduNova Department Portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Departmental Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  onBlur={() => {
                    const message = validateEmail(form.email);

                    setErrors((previous) => ({
                      ...previous,
                      email: message || undefined,
                    }));
                  }}
                  placeholder="Enter your departmental email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-blue-500"
                  }`}
                />
              </div>

              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border py-3 pl-10 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-blue-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14263F] px-4 py-3 font-semibold text-white transition hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Having trouble accessing your account?{" "}
            <Link
              to="/help"
              className="font-medium text-blue-700 hover:underline"
            >
              Contact support
            </Link>
          </p>

          <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
            EduNova Department Portal
          </p>

        </div>
      </div>
    </div>
  );
}
