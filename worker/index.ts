import { Hono } from "hono";
import { streamText } from "hono/streaming";
import OpenAI from "openai";

const app = new Hono<{ Bindings: Env }>();

app.post("/api/examples/create", async (c) => {
  const { prompt } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: prompt,
  });
  return c.json({ response, outputText: response.output_text });
});

app.post("/api/examples/create/streaming", async (c) => {
  const { prompt } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });
  const streamedResponse = await openai.responses.create({
    model: "gpt-4.1",
    input: prompt,
    stream: true,
  });
  c.header("Content-Encoding", "Identity");
  return streamText(c, async (stream) => {
    for await (const event of streamedResponse) {
      console.log(event);
      if (event.type === "response.output_text.delta") {
        stream.write(event.delta);
      }
    }
  });
});

export default app;
