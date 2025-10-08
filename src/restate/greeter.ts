import * as restate from "@restatedev/restate-sdk";
import { serde } from "@restatedev/restate-sdk-zod";
import { sendNotification, sendReminder } from "@/restate/utils";

import { z } from "zod";

const Greeting = z.object({
  name: z.string(),
});

const GreetingResponse = z.object({
  result: z.string(),
});

export const greeter = restate.service({
  name: "VercelGreeter",
  handlers: {
    greet: restate.createServiceHandler(
      { input: serde.zod(Greeting), output: serde.zod(GreetingResponse) },
      async (ctx: restate.Context, { name }) => {
        // Durably execute a set of steps; resilient against failures
        const greetingId = ctx.rand.uuidv4();

        await ctx.run("Notification", () => sendNotification(greetingId, name));

        // throw Error("🐛");

        await ctx.sleep({ seconds: 1 });
        await ctx.run("Reminder", () => sendReminder(greetingId, name));

        // Respond to caller
        return { result: `Greetings from Vercel, ${name}!` };
      },
    ),
  },
  options: {
    retryPolicy: {
      initialInterval: 50,
      exponentiationFactor: 1.5,
      maxInterval: 200,
      maxAttempts: 5,
      onMaxAttempts: "pause",
    },
  },
});

export type Greeter = typeof greeter;
