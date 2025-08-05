# Responsible

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/craigsdennis/responses-api-workers)

[<img src="https://img.youtube.com/vi/IAQcvQ_Vj0Y/0.jpg">](https://youtu.be/IAQcvQ_Vj0Y "Explore the OpenAI Responses API")

This is an educational exploration at the [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses).

It is running on [Cloudflare Workers](https://developers.cloudflare.com) and using the [Hono](https://honojs.dev) framework to host the API with a Vite+React front-end.

Check the API out at [worker/index.ts](./worker/index.ts)

## Develop

Copy [./.example.dev.vars](./example.dev.vars) to ./.dev.vars and replace with your key.

OPTIONAL: Modify your BASE_URL

```bash
npm run dev
```

## Deploy

Add your secrets to the Worker

```bash
npx wrangler secret bulk .dev.vars
```

```bash
npm run deploy
```
