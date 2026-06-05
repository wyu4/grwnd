"use client";
import BlackButton from "@/app/reusable/Buttons";
import { authClient, signInGitHub } from "@/utils/authentication/client";
import { useRef, useState } from "react";

type AuthMode = "Sign_In" | "Sign_Up";

export default function AuthPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [authenticating, setAuthenticating] = useState(false);

  return (
    <div className="bg-tertiary h-screen flex flex-col justify-center items-center">
      <div className="relative bg-secondary rounded-2xl flex flex-col justify-center items-center p-4 gap-2">
        <form
          className="flex flex-col justify-center items-center p-2 gap-1"
          onSubmit={async (e) => {
            e.preventDefault();
            setAuthenticating(true);
            const { error } = await signInGitHub();
            setAuthenticating(false);
            setError(error?.message);
          }}
        >
          <BlackButton
            type="submit"
            disabled={authenticating}
            style={{
              opacity: authenticating ? 0.5 : 1,
            }}
          >
            Continue with GitHub
          </BlackButton>
        </form>

        {error && <p className="text-center">{error}</p>}
      </div>
    </div>
  );
}
