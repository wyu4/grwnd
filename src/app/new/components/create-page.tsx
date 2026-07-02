"use client";

import { GlowBackground } from "@/app/reusable/Backgrounds";
import { BlackButton } from "@/app/reusable/Buttons";
import LoadingScreen from "@/app/reusable/loading";
import TopBar from "@/app/reusable/top-bar";
import { createPost } from "@/utils/database/database";
import { NEXT_PUBLIC_DESC_LIMIT, NEXT_PUBLIC_TITLE_LIMIT } from "@/utils/environment";
import { redirect } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creating) return;
    setCreating(true);

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const description = data.get("description")?.toString();
    const demo = data.get("link")?.toString();

    if (!title || !description) {
      setCreating(false);
      setMessage(`Please input a ${!title ? "title" : "description"}.`);
      return;
    }

    if (title.length > NEXT_PUBLIC_TITLE_LIMIT) {
      setCreating(false);
      setMessage(`Your title exceeds the character limit of ${NEXT_PUBLIC_TITLE_LIMIT}.`);
      return;
    }

    if (description.length > NEXT_PUBLIC_DESC_LIMIT) {
      setCreating(false);
      setMessage(`Your description exceeds the character limit of ${NEXT_PUBLIC_TITLE_LIMIT}.`);
      return;
    }

    const id = await createPost(title, description, demo);
    if (!id) {
      setCreating(false);
      return;
    }
    setLoading(true);
    redirect(`/post/${id}`);
  };

  return (
    <div className="relative bg-secondary min-h-screen w-full flex flex-col items-center justify-start">
      <LoadingScreen hidden={!loading} />
      <TopBar isLoggedIn={true} onNavigate={() => setLoading(true)} />
      {/* <GlowBackground
        className="absolute top-0 left-0 w-full h-full"
        cssVariable="--font-tertiary"
        count={5}
      /> */}
      <div className="relative w-full flex flex-col items-center justify-start gap-4 p-8">
        <form
          onSubmit={submit}
          className="relative text-xl p-8 gap-4 bg-primary border border-font-tertiary rounded-2xl flex flex-col justify-start items-center overflow-clip md:w-1/2"
        >
          <input
            className="bg-secondary text-3xl font-bold"
            name="title"
            type="text"
            placeholder="What is your project?"
          />
          <textarea
            className="bg-secondary!"
            name="description"
            placeholder="Expand on your idea."
          />
          <OptionalLink name="link" placeholder="https://" text="Website / Demo" />
          {message && (
            <div className="relative flex text-delete">
              <p>{message}</p>
            </div>
          )}
          <BlackButton
            className="relative shrink w-20 grid place-items-center"
            type="submit"
            disabled={creating}
            style={{
              opacity: creating ? 0.5 : 1,
            }}
          >
            <FaArrowRight />
          </BlackButton>
        </form>
      </div>
    </div>
  );
}

function OptionalLink({
  name,
  text,
  placeholder,
}: {
  name: string;
  text: string;
  placeholder: string;
}) {
  return (
    <div className="relative w-full flex flex-col justify-center items-start py-4 gap-2">
      <p>{`${text} (optional)`}</p>
      <input
        className="max-w-1/2 bg-secondary! text-start!"
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}
