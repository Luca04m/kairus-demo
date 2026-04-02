"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("success");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="gradient-text text-3xl font-semibold tracking-tight">
            Kairus OS
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com seu email para acessar a plataforma
          </p>
        </div>

        {status === "success" ? (
          <div className="glass-light rounded-xl p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-kairus-green/20">
              <svg
                className="h-6 w-6 text-kairus-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-foreground">
              Link enviado!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifique seu email <strong className="text-foreground">{email}</strong> e
              clique no link magico para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="focus-ring glass-light w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                disabled={status === "loading"}
              />
            </div>

            {status === "error" && errorMessage && (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="relative w-full overflow-hidden rounded-xl bg-kairus-blue px-4 py-3 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar link magico"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
