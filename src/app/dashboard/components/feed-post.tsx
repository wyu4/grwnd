import { UndraggableImage } from "@/app/reusable/Images";
import { calculateTimeElapse } from "@/utils/time-helpers";
import { useEffect, useState } from "react";
import { FaRegCalendar } from "react-icons/fa";

export default function FeedPost({
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
  const [timeElapsed, setTimeElapsed] = useState("loading...");

  useEffect(() => {
    const update = () =>
      setTimeElapsed(calculateTimeElapse(Date.now() - uploadDate.getTime()));
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
          <a
            className="text-lg"
            href={"/profile/" + author.id}
            onClick={onNavigate}
            aria-disabled={true}
          >
            <b>{author.username}</b>
          </a>
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
        <p>
          {description.length > 100 ? description.slice(0, 100) + "..." : description}
        </p>
      </div>
    </div>
  );
}
