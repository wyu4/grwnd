"use client";

import BlackButton from "@/app/reusable/Buttons";
import { authClient, signInGitHub } from "@/utils/authentication/client";
import { useState } from "react";

export default function TopBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [authenticating, setAuthenticating] = useState(false);

  return (
    <div className="fixed top-0 left-0 border-b-2 border-font-secondary w-full p-4 flex flex-row justify-center items-center">
      {!isLoggedIn && (
        <LogInPrompt
          onClick={async () => {
            if (authenticating) return;
            setAuthenticating(true);
            await signInGitHub();
            setAuthenticating(false);
          }}
          disabled={authenticating || isLoggedIn}
        />
      )}
    </div>
  );
}

function LogInPrompt({ onClick, disabled }: { onClick: () => any; disabled: boolean }) {
  return (
    <div className="relative flex flex-col gap-1 justify-center items-center">
      <p>Log in to create and interact with posts.</p>
      <BlackButton
        onClick={onClick}
        disabled={disabled}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
      >
        Log In
      </BlackButton>
    </div>
  );
}
