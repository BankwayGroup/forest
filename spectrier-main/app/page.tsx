"use client";

import { LoginButton } from "@telegram-auth/react";
import { signIn } from "next-auth/react";

export default function IndexPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
      <div className="w-full max-w-md space-y-6 bg-gray-800 rounded-2xl p-8 shadow-lg shadow-black/50">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
          Login to Access the Admin Page
        </h1>
        <p className="text-gray-400">
          Use your Telegram account to authenticate and manage the dashboard securely.
        </p>
        <LoginButton
          botUsername="SpectrierBot"
          onAuthCallback={(data) => {
            void signIn(
              "telegram-login",
              { callbackUrl: "/dashboard" },
              data as any
            );
          }}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors duration-200"
        />
      </div>
    </section>
  );
}
