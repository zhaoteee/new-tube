import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;
    if (!evt.data.id) {
      return new Response("Missing user id", { status: 400 });
    }
    if (eventType === "user.created") {
      await db.insert(users).values({
        clerkId: evt.data.id,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        imageUrl: evt.data.image_url,
      });
    }
    if (eventType === "user.deleted") {
      await db.delete(users).where(eq(users.clerkId, evt.data.id));
    }
    if (eventType === "user.updated") {
      await db
        .update(users)
        .set({
          name: `${evt.data.first_name} ${evt.data.last_name}`,
          imageUrl: evt.data.image_url,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, evt.data.id));
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
