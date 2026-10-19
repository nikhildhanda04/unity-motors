"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "../actions";
import { Eye, EyeOff } from "../../components/icons";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  const [showPassword, setShowPassword] = useState(false);

  const field =
    "w-full bg-[#0a0f12] border border-[#23292d] px-4 py-3 text-[15px] text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E43E3D] transition-colors";
  const label =
    "block text-gray-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-2";

  return (
    <main className="min-h-screen bg-[#0a0f12] flex items-center justify-center px-6 py-16 font-sans">
      <div className="w-full max-w-sm">
        <h1 className="text-[clamp(2.5rem,11vw,3.5rem)] font-black text-white uppercase tracking-[-0.045em] leading-[0.85]">
          Unity
          <br />
          Motors
        </h1>
        <p className="mt-5 pb-7 border-b-2 border-[#E43E3D] text-[#E43E3D] font-bold text-[11px] uppercase tracking-[0.18em]">
          Stock management — staff only
        </p>

        <form action={formAction} className="flex flex-col gap-5 mt-9">
          <div>
            <label className={label} htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="username"
              required
              autoFocus
              placeholder="9215593793"
              className={`${field} tnum`}
            />
          </div>

          <div>
            <label className={label} htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className={`${field} pr-12`}
              />
              {/*
                type="button" is load-bearing: a bare <button> inside a form
                defaults to submit, so this would try to log in on every tap.
                The label states the action, not the state — a screen reader
                announcing "password is hidden" does not say what pressing does.
              */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="password"
                className="absolute inset-y-0 right-0 grid place-items-center w-12 text-gray-400 hover:text-white transition-[color] duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 bg-[#E43E3D] hover:bg-[#c7322f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-widest py-4 transition-colors"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>

          {state.error && (
            <p
              role="alert"
              className="border-l border-[#E43E3D] bg-[#E43E3D]/10 px-4 py-3 text-[#ff8a89] text-[13px] font-medium"
            >
              {state.error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
