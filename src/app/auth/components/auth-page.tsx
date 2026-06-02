"use client";
import { signIn, signUp } from "@/utils/supabase/server";
import { useRef, useState } from "react";

type AuthMode = "Sign_In" | "Sign_Up";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("Sign_In");
  const [error, setError] = useState<string | undefined>(undefined);
  const [authenticating, setAuthenticating] = useState(false);

  return (
    <div className="bg-tertiary h-screen flex flex-col justify-center items-center">
      <div className="relative bg-secondary rounded-2xl flex flex-col justify-center items-center p-4 gap-2">
        <h1>{mode === "Sign_In" ? "Sign In" : "Sign Up"}</h1>
        <form
          action={async (data) => {
            if (authenticating) return;
            setAuthenticating(true);
            let error: string | undefined = undefined;
            if (mode === "Sign_In") {
              error = await signIn(data);
            } else {
              error = await signUp(data);
            }
            setAuthenticating(false);
            setError(error);
          }}
          className="flex flex-col justify-center items-center p-2 gap-1"
        >
          {mode === "Sign_Up" && (
            <input type="text" name="username" placeholder="username" required />
          )}
          <input type="email" name="email" placeholder="valid.email@wyu.app" required />
          <input type="password" name="password" placeholder="password" required />
          <button
            type="submit"
            disabled={authenticating}
            className="bg-font-primary mt-1 text-primary rounded-full text-center px-4 py-1"
            style={{
              opacity: authenticating ? 0.5 : 1,
            }}
          >
            {mode === "Sign_In" ? "Enter" : "Create Account"}
          </button>
        </form>
        <button
          className="underline"
          style={{
            opacity: authenticating ? 0.5 : 1,
          }}
          disabled={authenticating}
          onClick={() => {
            if (authenticating) return;
            setError(undefined);
            setMode((last) => (last === "Sign_In" ? "Sign_Up" : "Sign_In"));
          }}
        >
          {mode === "Sign_In" ? "Create an account" : "Log into an existing account"}
        </button>
        {error && <p className="text-center">{error}</p>}
      </div>
    </div>
  );
}
