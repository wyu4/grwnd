"use client";
import { authClient } from "@/utils/authentication/client";
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
            const { error } = await authClient.signIn.social({
              provider: "github",
              callbackURL: "/dashboard",
            });
            setAuthenticating(false);
            setError(error?.message);
          }}
        >
          <button
            type="submit"
            disabled={authenticating}
            className="bg-font-primary mt-1 text-primary rounded-full text-center px-4 py-1"
            style={{
              opacity: authenticating ? 0.5 : 1,
            }}
          >
            Continue with GitHub
          </button>
        </form>

        {error && <p className="text-center">{error}</p>}
      </div>
    </div>
  );
}
