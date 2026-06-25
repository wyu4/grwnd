"use client";

import { authClient, signInGitHub } from "@/utils/authentication/client";
import { useState } from "react";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { PageType } from "@/types/global";
import { FaCirclePlus } from "react-icons/fa6";
import { BlackButton, TabButton } from "./Buttons";
import { MdCancel } from "react-icons/md";

export default function TopBar({ isLoggedIn, onNavigate }: PageType & { onNavigate?: () => void }) {
  const [authenticating, setAuthenticating] = useState(false);

  return (
    <div className="sticky z-100 bg-primary top-0 left-0 border-b border-font-secondary w-full p-2 flex flex-row justify-center items-center shrink-0">
      {!isLoggedIn && (
        <LogInPrompt
          onClick={async () => {
            if (authenticating) return;
            setAuthenticating(true);
            await signInGitHub();
            onNavigate?.();
            setAuthenticating(false);
          }}
          disabled={authenticating || isLoggedIn}
        />
      )}
      {isLoggedIn && <AuthenticatedTopBar onNavigate={onNavigate} />}
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

function AuthenticatedTopBar({ onNavigate }: { onNavigate?: () => void }) {
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="relative w-full flex flex-row justify-center items-center text-4xl gap-4">
      <TabButton href="/dashboard" name="Home" onClick={onNavigate}>
        <FaHome />
      </TabButton>
      <TabButton href="/new" name="Create" onClick={onNavigate}>
        <FaCirclePlus />
      </TabButton>
      <TabButton href="/profile" name="Profile" onClick={onNavigate}>
        <FaUser />
      </TabButton>
      <TabButton
        href={null}
        className="absolute right-0 mr-4"
        onClick={() => setSigningOut(true)}
        isButton={true}
      >
        <FaSignOutAlt />
      </TabButton>
      <div
        className="absolute bg-secondary max-w-40 right-0 mr-4 -bottom-full flex flex-col p-2 gap-4 rounded-xl border border-font-tertiary"
        hidden={!signingOut}
      >
        <p className="text-sm text-center">Are you sure you want to sign out?</p>
        <div className="flex flex-row justify-center items-center gap-4">
          <TabButton href={null} onClick={() => setSigningOut(false)} isButton={true}>
            <MdCancel />
          </TabButton>
          <TabButton
            href={null}
            onClick={() => {
              onNavigate?.();
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => window.location.reload(),
                },
              });
            }}
            isButton={true}
          >
            <FaSignOutAlt />
          </TabButton>
        </div>
      </div>
    </div>
  );
}
