import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

const TITLE_SYSTEM_PROMPT = `
    Your task is to summarize the transcript of a video. Pleasefollow these guidelines:
    - Be brief. condense the content into a summary that captures the key points and main ideas without losing important details.
    - Avoid jargon or overly complex language unless necessary for the context
    - Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
    - ONLY return the summary, no other text,annotations,or comments.
    - Aim for a summary that is 3-5 sentences long and no more than 200 characters.
`;

export const { POST } = serve(async (context) => {
  const { videoId, userId } = context.requestPayload as {
    userId: string;
    videoId: string;
  };
  const video = await context.run("get-video-desc", async () => {
    const [video] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!video) throw new Error("Video not found");
    return video;
  });
  const transcript = await context.run("get-transcript-desc", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();
    if (!text) {
      throw new Error("Bad request");
    }
    return text;
  });

  const { body } = await context.api.openai.call(
    "Call qwen-plus get description",
    {
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
    }
  );
  const description = body.choices[0]?.message.content;
  if (!description) {
    throw new Error("Bad request");
  }
  await context.run("update-video-description", async () => {
    await db
      .update(videos)
      .set({ description: description || "我是假数据" })
      .where(and(eq(videos.id, video.id), eq(videos.userId, userId)));
  });
});
