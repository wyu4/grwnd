"use client";

import { UndraggableImage } from "@/app/reusable/Images";
import LoadingScreen from "@/app/reusable/loading";
import TopBar from "@/app/reusable/top-bar";
import { getPost } from "@/utils/database/database";
import { calculateTimeElapse, convertDateToReadable } from "@/utils/time-helpers";
import { useEffect, useRef, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";

type PostPageType = {
  isLoggedIn: boolean;
  isQuerier: boolean;
  postData: Awaited<ReturnType<typeof getPost>>;
};

export default function PostPage({ isLoggedIn, isQuerier, postData }: PostPageType) {
  const post = postData!.post;
  const author = postData!.author;
  const uploadDate = new Date(post.created_at ?? 0);

  const [loading, setLoading] = useState(false);

  const onNavigate = () => setLoading(true);

  return (
    <div className="relative bg-primary w-full flex flex-col justify-start items-center">
      <LoadingScreen hidden={!loading} />
      <TopBar isLoggedIn={isLoggedIn} onNavigate={onNavigate} />
      {!!postData && (
        <div className="relative w-full h-full flex flex-col justify-center items-center p-4">
          <Post
            author={{
              icon: author.icon,
              id: post.id,
              label: author.role ?? "",
              username: author.default_name,
            }}
            title={post.title}
            description={post.description}
            onNavigate={onNavigate}
            uploadDate={uploadDate}
          />
        </div>
      )}
    </div>
  );
}

function Post({
  author,
  title,
  description,
  uploadDate,
  onNavigate,
}: {
  author: PostAuthor;
  title: string;
  description: string;
  uploadDate: Date;
  onNavigate: () => void;
}) {
  const [timeElapsed, setTimeElapsed] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setTimeElapsed(calculateTimeElapse(Date.now() - uploadDate.getTime()));
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, [uploadDate]);
  return (
    <div className="relative bg-primary border border-font-tertiary rounded-2xl flex flex-col justify-start items-center overflow-clip md:w-1/2">
      <div className="relative w-full bg-inherit rounded-t-2xl pt-4 z-10">
        <h1 className="w-full text-center">{title}</h1>
      </div>

      <div className="relative flex flex-col justify-start items-center w-full px-8 py-4 gap-2 z-5">
        <div className="relative flex flex-row gap-[inherit] justify-start items-center w-full">
          <UndraggableImage
            src={author.icon}
            alt={author.username}
            className="aspect-square w-15 rounded-full"
          />
          <div className="relative flex flex-col justify-center items-start">
            <a
              className="text-lg"
              href={"/profile/" + author.id}
              onClick={onNavigate}
              aria-disabled={true}
            >
              <b>{author.username}</b>
            </a>
            <p className="text-sm">{author.label}</p>
            <div
              title={`Uploaded ${convertDateToReadable(uploadDate)}`}
              className="text-sm text-font-secondary flex flex-row justify-start items-center gap-1"
            >
              <FaRegCalendar /> <p>{timeElapsed}</p>
            </div>
          </div>
        </div>
        <div className="relative bg-font-secondary w-full h-px" />
        <p className="text-xl w-full">{description}</p>
      </div>
    </div>
  );
}
