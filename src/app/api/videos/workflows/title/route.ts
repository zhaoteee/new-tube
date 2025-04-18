import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

const TITLE_SYSTEM_PROMPT = `
    Your task is to generate an SEO-focused title for a YouTube video based on its transcript,
    "please follow these guidelines:
    - Be concise but descriptive, using relevant keywords to improve discoverability.
    - Highlight the most compelling or unique aspect of the video content.
    - Avoid jargon or overly complex language unless it directly supports searchability.
    - Use action-oriented phrasing or clear value propositions where applicable.
    -Ensure the title is 3-8 words long and no more than 100 characters.
    -ONLY return the title as plain text, Do not add quotes or any additional formatting.'
`;

export const { POST } = serve(async (context) => {
  const { videoId, userId } = context.requestPayload as {
    userId: string;
    videoId: string;
  };

  const video = await context.run("get-video", async () => {
    const [video] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!video) throw new Error("Video not found");
    return video;
  });
  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();
    if (!text) {
      throw new Error("Bad request");
    }
    return text;
  });

  const { status, body } = await context.api.openai.call("Call qwen-plus", {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode",
    token: process.env.OEPNAI_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "qwen-plus",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
    },
  });
  const title = body.choices[0]?.message.content;
  if (!title) {
    throw new Error("Bad request");
  }
  await context.run("update-video-title", async () => {
    await db
      .update(videos)
      .set({ title: title || "我是假数据" })
      .where(and(eq(videos.id, video.id), eq(videos.userId, userId)));
  });
});
