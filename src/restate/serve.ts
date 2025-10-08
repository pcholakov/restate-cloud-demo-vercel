import * as restate from "@restatedev/restate-sdk/fetch";
import { greeter } from "@/restate/greeter";

const endpoint = restate.createEndpointHandler({
  services: [greeter],
  // identityKeys: ["publickeyv1_5pEm4dA2ED5hM3EBGaBSkx7wfjm1wzCkDs4rLxAror8Q"],
});

// Adapt it to Next.js route handlers
export const serve = () => {
  return {
    POST: (req: Request) => endpoint(req),
    GET: (req: Request) => endpoint(req),
  };
};
