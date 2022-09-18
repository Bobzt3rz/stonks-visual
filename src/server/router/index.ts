// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { guestbookRouter } from "./guestbook";
import { secRouter } from "./sec";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("guestbook", guestbookRouter)
  .merge("sec", secRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
