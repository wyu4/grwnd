"use client";

import BlackButton from "@/app/reusable/Buttons";
import gsap from "gsap";
import { signInGitHub } from "@/utils/authentication/client";
import { useGSAP } from "@gsap/react";
import { forwardRef, ReactNode, useRef, useState } from "react";
import { FaHome } from "react-icons/fa";

const TopBar = forwardRef<HTMLDivElement, { isLoggedIn: boolean }>(
  ({ isLoggedIn }, fref) => {
    const [authenticating, setAuthenticating] = useState(false);

    return (
      <div
        ref={fref}
        className="fixed z-100 bg-primary top-0 left-0 border-b border-font-secondary w-full p-2 flex flex-row justify-center items-center"
      >
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
        {isLoggedIn && <AuthenticatedTopBar />}
      </div>
    );
  },
);

export default TopBar;

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

function AuthenticatedTopBar() {
  return (
    <div className="relative flex flex-row justify-around items-center text-4xl gap-2">
      <TabButton href="/dashboard" name="Home">
        <FaHome />
      </TabButton>
    </div>
  );
}

function TabButton({
  href,
  name,
  children,
}: {
  name: string;
  href: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovering, setHovering] = useState(false);

  useGSAP(() => {
    if (ref.current === null) return;
    gsap.set(ref.current, {
      color: hovering ? "var(--font-secondary)" : "var(--font-primary)",
    });
  }, [hovering]);

  return (
    <a
      ref={ref}
      className="relative flex flex-col justify-center items-center text-3xl gap-0.5 text-font-primary"
      href={href}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children}
      <p className="text-sm">{name}</p>
    </a>
  );
}
