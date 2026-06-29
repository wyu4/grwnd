import { getPosts } from "@/utils/database/database";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getPosts();
  return !posts ? NextResponse.json("No data found.", { status: 404 }) : NextResponse.json(posts.posts);
}
