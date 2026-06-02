"use client";
import { signIn, signUp } from "@/utils/supabase/server";
import { useState } from "react";

type AuthMode = "Sign_In" | "Sign_Up";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("Sign_In");

  return (
    <div className="bg-tertiary h-screen flex flex-col justify-center items-center">
      <div className="relative bg-secondary rounded-2xl flex flex-col justify-center items-center p-4 gap-2">
        <h1>{mode === "Sign_In" ? "Sign In" : "Sign Up"}</h1>
        <form
          action={async (data) => {
            if (mode === "Sign_In") {
              await signIn(data);
            } else {
              await signUp(data);
            }
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
            className="bg-font-primary mt-1 text-primary rounded-full text-center px-4 py-1"
          >
            {mode === "Sign_In" ? "Enter" : "Create Account"}
          </button>
        </form>
        <button
          className="underline"
          onClick={() => setMode((last) => (last === "Sign_In" ? "Sign_Up" : "Sign_In"))}
        >
          {mode === "Sign_In" ? "Create an account" : "Log into an existing account"}
        </button>
      </div>
    </div>
  );
}
