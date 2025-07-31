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
      if (event.type === "response.output_text.delta") {
        stream.write(event.delta);
      }
    }
  });
});

app.post("/api/examples/create/stored", async (c) => {
    const { word, previous_response_id } = await c.req.json();
    const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });

    const response = await openai.responses.create({
      instructions: `You are playing a game of one word at a time. 
        The user is going to respond with a single word that moves the story forward. 
        Only reply with a single word and perhaps punctuation if it is the end of a sentence.`,
      input: word,
      model: "gpt-4.1",
      store: true, //this is the default, being explicit
      previous_response_id
    });
    return c.json({response, previous_response_id: response.id, word: response.output_text});
});


export default app;
