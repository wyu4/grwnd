"use client";

import { GlowBackground } from "@/app/reusable/Backgrounds";
import { BlackButton } from "@/app/reusable/Buttons";
import LoadingScreen from "@/app/reusable/loading";
import TopBar from "@/app/reusable/top-bar";
import { createPost } from "@/utils/database/database";
import { redirect } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);

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
      return;
    }

    const id = await createPost(title, description, demo);
    if (!id) {
      setCreating(false);
      return;
    }
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
          className="relative overflow-clip bg-tertiary border border-font-tertiary rounded-2xl flex flex-col items-center justify-center w-1/2 p-4 gap-2"
        >
          <input required name="title" type="text" placeholder="What is your project?" />
          <textarea required name="description" placeholder="Expand on your idea." />
          <OptionalLink name="link" placeholder="https://" text="Website / Demo" />
          <BlackButton
            className="relative shrink w-20 grid place-items-center"
            type="submit"
            disabled={creating}
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
      <input className="max-w-1/2 text-start!" name={name} placeholder={placeholder} />
    </div>
  );
}
