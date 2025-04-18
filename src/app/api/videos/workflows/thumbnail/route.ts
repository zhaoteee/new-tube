import { db } from "@/db";
import { videos } from "@/db/schema";
import { waitFor } from "@/lib/utils";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

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
  const { body } = await context.call<{
    output: {
      task_status: string;
      task_id: string;
    };
    request_id: string;
  }>("Call qwen-plus", {
    url: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis",
    method: "POST",
    body: {
      input: {
        prompt: prompt,
      },
      model: "wanx2.0-t2i-turbo",
      parameters: {
        n: 1,
        size: "1152*864",
      },
    },
    headers: {
      Authorization: `Bearer ${process.env.OEPNAI_KEY!}`,
      ContentType: "application/json",
      "X-DashScope-Async": "enable",
    },
  });
  console.log("Call qwen-plus---->>>>", JSON.stringify(body));
  const task_id = body.output.task_id;
  // 通义万相-文生图V2 这里需要轮询获取图片
  const tempThumbnailUrl = await context.run(
    "get-qianwen-img-url",
    async () => {
      const url = await getUrl(task_id);
      return url;
    }
  );
  console.log(tempThumbnailUrl);
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

type Res = {
  output: {
    task_status: string;
    results: { url: string }[];
  };
};

async function getUrl(request_id: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reqHeaders = new Headers();
    reqHeaders.set("Authorization", `Bearer ${process.env.OEPNAI_KEY}`);
    const options = {
      headers: reqHeaders,
    };
    const response = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${request_id}`,
      options
    );
    const text: Res = await response.json();
    if (text.output.task_status === "SUCCEEDED") {
      resolve(text.output.results[0].url as string);
    } else if (text.output.task_status === "FAILED") {
      reject();
      new Error("FAILED to generate");
    } else {
      await waitFor(1000);
      const url = await getUrl(request_id);
      resolve(url);
    }
  });
}
