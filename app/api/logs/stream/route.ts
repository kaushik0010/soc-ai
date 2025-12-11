import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";

export const runtime = "nodejs"; // SSE requires Node runtime
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await connectDB();

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Initial event (optional)
      send({ status: "connected", time: Date.now() });

      // Mongoose change stream
      const changeStream = LogEntry.watch([], { fullDocument: "updateLookup" });

      changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
          send({
            type: "new_log",
            log: change.fullDocument,
          });
        }
      });

      // Heartbeat every 10 seconds to keep connection alive
      const interval = setInterval(() => {
        controller.enqueue(`event: heartbeat\ndata: ping\n\n`);
      }, 10000);

      // Close logic
      const close = () => {
        clearInterval(interval);
        changeStream.close().catch(() => {});
        controller.close();
      };

      // If client closes connection
      req.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
