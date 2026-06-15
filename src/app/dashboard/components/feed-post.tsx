import { UndraggableImage } from "@/app/reusable/Images";
import { Elsie } from "next/font/google";
import { useEffect, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";

export default function FeedPost({
  author,
  title,
  description,
  uploadDate,
}: {
  author: PublicUser;
  title: string;
  description: string;
  uploadDate: Date;
}) {
  const [timeElapsed, setTimeElapsed] = useState("loading...");

  useEffect(() => {
    const formulate = (n: number, unit: string) => `${n} ${unit}${n > 1 ? "s" : ""} ago`;
    const update = () => {
      const seconds = Math.floor((Date.now() - uploadDate.getTime()) / 1000);
      if (seconds <= 0) {
        setTimeElapsed("now");
      } else if (seconds < 60) {
        setTimeElapsed(formulate(seconds, "second"));
      } else if (seconds < 60 * 60) {
        setTimeElapsed(formulate(Math.floor(seconds / 60), "minute"));
      } else if (seconds < 60 * 60 * 24) {
        setTimeElapsed(formulate(Math.floor(seconds / 60 / 60), "hour"));
      } else if (seconds < 60 * 60 * 24 * 7) {
        setTimeElapsed(formulate(Math.floor(seconds / 60 / 60 / 24), "day"));
      } else if (seconds < 60 * 60 * 24 * 30) {
        setTimeElapsed(formulate(Math.floor(seconds / 60 / 60 / 24 / 7), "week"));
      } else if (seconds < 60 * 60 * 24 * 365) {
        setTimeElapsed(formulate(Math.floor(seconds / 60 / 60 / 24 / 30), "month"));
      } else {
        setTimeElapsed(formulate(Math.floor(seconds / 60 / 60 / 24 / 365), "year"));
      }
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, [uploadDate]);

  return (
    <div className="relative shrink-0 w-full border border-font-primary rounded-lg bg-primary flex flex-col justify-start items-center p-4 gap-4">
      <div className="relative flex flex-row gap-[inherit] w-full justify-start items-center">
        <UndraggableImage
          src={author.icon}
          alt={author.username}
          className="aspect-square w-15 rounded-full"
        />
        <div className="relative flex flex-col justify-center items-start">
          <p className="text-lg">
            <b>{author.username}</b>
          </p>
          <p className="text-sm">{author.label}</p>
          <div className="text-sm text-font-secondary flex flex-row justify-start items-center gap-1">
            <FaRegCalendar /> <p>{timeElapsed}</p>
          </div>
        </div>
      </div>
      <div className="relative bg-font-secondary w-full h-px" />
      <div className="relative w-full flex flex-col gap-[inherit]">
        <h1 aria-disabled={true}>
          <b>{title}</b>
        </h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
