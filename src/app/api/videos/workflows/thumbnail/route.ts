import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

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
  const { videoId, userId, prompt } = context.requestPayload as {
    userId: string;
    videoId: string;
    prompt: string;
  };

  const video = await context.run("get-video", async () => {
    const [video] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!video) throw new Error("Video not found");
    return video;
  });
  // 通义万相-文生图V2 这里需要轮询获取图片
  const { body } = await context.call<{ data: { url: string }[] }>(
    "Call qwen-plus",
    {
      url: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
      method: "POST",
      body: {
        input: {
          prompt: prompt,
        },
        model: "wanx2.0-t2i-turbo",
        parameters: {
          n: 1,
        },
      },
      headers: {
        Authorization: `Bearer ${process.env.OEPNAI_KEY!}`,
        ContentType: "application/json",
        "X-DashScope-Async": "enable",
      },
    }
  );
  console.log(JSON.stringify(body));
  const tempThumbnailUrl = body.data[0].url;
  if (!tempThumbnailUrl) {
    throw new Error("Bad request");
  }
  const thumbnail = await context.run("upload-thumbnail", async () => {
    const utapi = new UTApi();
    const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);
    if (!data) {
      throw new Error("Bad request");
    }
    return data;
  });
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ thumbnailUrl: thumbnail.ufsUrl, thumbnailKey: thumbnail.key })
      .where(and(eq(videos.id, video.id), eq(videos.userId, userId)));
  });
});
