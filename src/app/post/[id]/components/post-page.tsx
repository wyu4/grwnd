"use client";

import { BlackButton, PushButton, PushLink, TabButton } from "@/app/reusable/Buttons";
import { UndraggableImage } from "@/app/reusable/Images";
import LoadingScreen from "@/app/reusable/loading";
import TopBar from "@/app/reusable/top-bar";
import { deletePost, getPost, updatePost } from "@/utils/database/database";
import { calculateTimeElapse, convertDateToReadable } from "@/utils/time-helpers";
import { redirect } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCheck, FaEdit, FaLink, FaRegCalendar } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

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
  const [deleting, setDeleting] = useState(false);

  const onNavigate = () => setLoading(true);
  const onDelete = async () => {
    onNavigate();
    const status = await deletePost(post.id);
    if (status) {
      redirect("/dashboard");
    }
    setLoading(false);
    setDeleting(false);
  };

  return (
    <div className="relative bg-primary w-full min-h-screen flex flex-col justify-start items-center">
      <LoadingScreen hidden={!loading} />
      <TopBar isLoggedIn={isLoggedIn} onNavigate={onNavigate} />
      {!!postData && (
        <div className="relative grow w-full h-full flex flex-col justify-center items-center p-4">
          <Post
            postId={post.id}
            onDelete={() => setDeleting(true)}
            editable={isQuerier}
            author={{
              icon: author.icon,
              id: post.author ?? "",
              label: author.role ?? "",
              username: author.default_name,
            }}
            title={post.title}
            description={post.description}
            onNavigate={onNavigate}
            uploadDate={uploadDate}
            link={post.demo ?? undefined}
            repo={post.repo ?? undefined}
          />
          <div
            hidden={!deleting}
            className="absolute top-0 left-0 w-full h-full bg-font-primary/50 z-20 p-4 flex flex-col items-center justify-center"
          >
            <div className="relative bg-primary rounded-xl border border-font-tertiary flex flex-col p-8 gap-4 md:max-w-1/2">
              <p className="text-xl">Are you sure you want to delete this post?</p>
              <div className="flex flex-row justify-around items-center gap-4 text-xl font-bold">
                <TabButton
                  href={null}
                  onClick={() => setDeleting(false)}
                  isButton={true}
                  name="cancel"
                >
                  <MdCancel />
                </TabButton>
                <TabButton href={null} onClick={onDelete} isButton={true} name="delete">
                  <FaCheck />
                </TabButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Post({
  postId,
  author,
  title,
  description,
  uploadDate,
  link,
  repo,
  editable,
  onDelete,
  onNavigate,
}: {
  onDelete?: () => void;
  postId: string;
  author: PostAuthor;
  title: string;
  description: string;
  uploadDate: Date;
  link?: string;
  repo?: string;
  editable: boolean;
  onNavigate: () => void;
}) {
  const [timeElapsed, setTimeElapsed] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const update = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (updating) return;
    setUpdating(true);

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const description = data.get("description")?.toString();
    const demo = data.get("link")?.toString();

    if (!title || !description) {
      setUpdating(false);
      return;
    }

    const status = await updatePost(postId, title, description, demo);
    if (!status) {
      setUpdating(false);
      return;
    }
    window.location.reload();
  };

  useEffect(() => {
    const update = () => setTimeElapsed(calculateTimeElapse(Date.now() - uploadDate.getTime()));
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, [uploadDate]);
  return (
    <form
      className="relative bg-primary border border-font-tertiary rounded-2xl flex flex-col justify-start items-center overflow-clip md:w-1/2"
      onReset={(e) => {
        e.preventDefault();
        if (updating) return;
        setEditing(false);
      }}
      onSubmit={update}
    >
      <LoadingScreen hidden={!updating} />
      <div className="relative w-full bg-inherit rounded-t-2xl p-4 flex flex-col justify-center items-center gap-1">
        {!editing ? (
          <h1 className="text-center">{title}</h1>
        ) : (
          <input
            required
            name="title"
            type="text"
            defaultValue={title}
            placeholder="What is your project?"
            className="bg-secondary! font-bold text-3xl"
          />
        )}
        {editable && !editing && (
          <PushButton
            onClick={() => setEditing(true)}
            className="text-xl aspect-auto! w-40! h-10! p-2! rounded-full!"
          >
            <FaEdit />
          </PushButton>
        )}
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
        {!editing ? (
          description.split("\n").map((paragraph, i) => (
            <p className="text-xl w-full" key={`par-${i}`}>
              {paragraph}
            </p>
          ))
        ) : (
          <textarea
            required
            name="description"
            placeholder="Expand on your idea."
            defaultValue={description}
            className="bg-secondary! text-xl"
          />
        )}

        {!editing ? (
          <div className="relative flex flex-row justify-center items-center w-full">
            <PostLink name="Demo" link={link} children={<FaLink />} />
            <PostLink name="GitHub" link={repo} children={<FaLink />} />
          </div>
        ) : (
          <>
            <div className="relative flex flex-col justify-center items-center w-full">
              <OptionalLink
                name="link"
                placeholder="https://"
                text="Website / Demo"
                defaultValue={link}
              />
            </div>
            <div className="relative mt-10 flex flex-row justify-between items-center w-full">
              <BlackButton
                type="button"
                onClick={onDelete}
                className="relative bg-delete! shrink w-20 h-10 grid place-items-center"
              >
                <FaTrashCan />
              </BlackButton>
              <div className="relative flex flex-row justify-center items-center gap-2">
                <BlackButton
                  className="relative shrink w-20 h-10 grid place-items-center"
                  type="reset"
                >
                  <MdCancel />
                </BlackButton>
                <BlackButton
                  className="relative shrink w-20 h-10 grid place-items-center"
                  type="submit"
                >
                  <FaCheck />
                </BlackButton>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
}

function PostLink({ name, link, children }: { link?: string; name: string; children?: ReactNode }) {
  return (
    <>
      {link && (
        <div className="relative flex flex-col items-center justify-start gap-2 text-xl">
          <p>
            <b>{name}</b>
          </p>
          <PushLink
            href={link}
            target="_blank"
            className="aspect-auto! w-20! h-10! p-2! rounded-full!"
          >
            {children}
          </PushLink>
        </div>
      )}
    </>
  );
}

function OptionalLink({
  name,
  text,
  defaultValue,
  placeholder,
}: {
  name: string;
  text: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <div className="relative w-full flex flex-col justify-center items-start py-4 gap-2 text-xl">
      <p>{`${text} (optional)`}</p>
      <input
        className="w-70! bg-secondary! text-start!"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
