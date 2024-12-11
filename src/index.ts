import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import authRouter from "./routers/auth.router.ts";
import CustomError from "./utils/customError.ts";

const app = new Application();

const rootRouter = new Router();
rootRouter.get("/", (ctx) => {
  ctx.response.body = { message: "ok, but go to /api/v1" };
});

rootRouter.get("/api/v1", (ctx) => {
  ctx.response.body = { message: "ok" };
});

const apiRouter = new Router();

apiRouter.use(authRouter.prefix("/auth").routes());
apiRouter.use(authRouter.allowedMethods());

app.use(async (ctx, next) => {
  console.log(`Incoming request: ${ctx.request.method} ${ctx.request.url}`);
  await next();
  console.log(`Response status: ${ctx.response.status}`);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    if (err instanceof CustomError) {
      ctx.response.status = err.statusCode;
      ctx.response.body = { error: err.clientMessage };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal Server Error" };
    }
  }
});

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

app.use(apiRouter.prefix("/api/v1").routes());
app.use(apiRouter.allowedMethods());

const PORT = 8000;
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
