"use client";

import BlackButton from "@/app/reusable/Buttons";
import { authClient, signInGitHub } from "@/utils/authentication/client";
import { useState } from "react";

export default function TopBar() {
  const { value: sessionData } = authClient.useSession;
  const isLoggedIn = sessionData?.data?.user !== undefined;

  const [authenticating, setAuthenticating] = useState(false);
  return (
    <div className="fixed top-0 left-0 border-b-2 border-font-secondary w-full p-4 flex flex-row justify-center items-center">
      <div className="relative flex flex-col gap-1 justify-center items-center">
        <p>Log in to create and interact with posts.</p>
        <BlackButton
          onClick={async () => {
            setAuthenticating(true);
            await signInGitHub();
            setAuthenticating(false);
          }}
          disabled={authenticating || sessionData?.data?.user !== undefined}
          style={{
            opacity: authenticating ? 0.5 : 1,
          }}
        >
          Log In
        </BlackButton>
      </div>
    </div>
  );
}
