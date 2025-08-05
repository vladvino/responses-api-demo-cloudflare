import { Hono } from "hono";
import { streamText } from "hono/streaming";
import OpenAI from "openai";

const app = new Hono<{ Bindings: Env }>();

app.post("/api/examples/create", async (c) => {
  const { prompt } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });
  const response = await openai.responses.create({
    model: "gpt-4.1",
    input: prompt,
  });
  return c.json({ response, outputText: response.output_text });
});

app.post("/api/examples/create/streaming", async (c) => {
  const { prompt } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });
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
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });

  const response = await openai.responses.create({
    model: "gpt-4.1",
    instructions: `You are playing a game of one word at a time. 
        The user is going to respond with a single word that moves the story forward. 
        Only reply with a single word and perhaps punctuation if it is the end of a sentence.`,
    input: word,
    store: true, //this is the default, being explicit
    previous_response_id,
  });
  return c.json({
    response,
    previous_response_id: response.id,
    word: response.output_text,
  });
});

app.post("/api/examples/create/code-interpreter", async (c) => {
  const { story } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });

  const response = await openai.responses.create({
    model: "gpt-4.1",
    instructions: `Your job is to calculate how much time was spent based on free form text.
      Then use that time to figure out how much it would've cost in US minimum wage of $15.
      Respond to the user with how much time you estimated and total amount they would have been paid using the python tool.
    `,
    input: story,
    include: ["code_interpreter_call.outputs"],
    tool_choice: "required",
    tools: [
      {
        type: "code_interpreter",
        container: { type: "auto" },
      },
    ],
  });
  return c.json({ response, outputText: response.output_text });
});

type Feedback = {
  nps: number;
  whatWorked?: string;
  whatCouldBeImproved?: string;
};
function submitFeedback({ nps, whatWorked, whatCouldBeImproved }: Feedback) {
  console.log("Probably should save this to a database", {
    nps,
    whatWorked,
    whatCouldBeImproved,
  });
  return { success: true, assignee: "Bob", submissionId: crypto.randomUUID() };
}

app.post("/api/examples/create/function-calling", async (c) => {
  const { feedback } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });

  const input: OpenAI.Responses.ResponseInputItem[] = [
    { role: "user", content: feedback },
  ];
  const tools: OpenAI.Responses.Tool[] = [
    {
      type: "function",
      name: "submitFeedback",
      strict: true,
      description: "Used to send feedback from the user",
      parameters: {
        type: "object",
        properties: {
          nps: {
            type: "number",
            description:
              "Net Promoter Score: A number between 0 and 10 on how likely the user would recommend this demo to a friend or co-worker?",
          },
          whatWorked: {
            type: "string",
            description: "What the user liked about the demo",
          },
          whatCouldBeImproved: {
            type: "string",
            description: "What could be improved",
          },
        },
        required: ["nps", "whatWorked", "whatCouldBeImproved"],
        additionalProperties: false,
      },
    },
  ];
  const instructions = `The user is going to submit feedback about this demo. 
      You will tell them that their feedback has been recorded.
      Ensure to include their feedback submission id in your response as well as who has been assigned their feedback submission.`;
  const firstResponse = await openai.responses.create({
    model: "gpt-4.1",
    input,
    instructions,
    tools,
    tool_choice: "required"
  });
  const toolCall = firstResponse.output[0];

  let finalResponse;
  let result;
  if (toolCall.type === "function_call" && toolCall.name === "submitFeedback") {
    const args = JSON.parse(toolCall.arguments);
    result = submitFeedback(args);
    // Include the tool call
    input.push(toolCall);
    // Append the result so the model can use it
    input.push({
      type: "function_call_output",
      call_id: toolCall.call_id,
      output: JSON.stringify(result),
    });
    finalResponse = await openai.responses.create({
      model: "gpt-4.1",
      instructions,
      input,
      tools,
    });
  }
  return c.json({
    firstResponse,
    finalResponse,
    outputText: finalResponse?.output_text,
    result,
  });
});

app.post("/api/examples/create/character-sample", async (c) => {
  const { title } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });

  const response = await openai.responses.create({
    model: "gpt-4.1",
    instructions: `You will take a title of a piece of content and use your knowledge to create a character synopsis.
    Use first and last names for the characters if you know them.
    Be detailed in the characters are related and what situations they have interacted.
    Write this in paragraph format.`,
    input: title,
  });
  return c.json({ outputText: response.output_text });
});

app.post("/api/examples/create/reasoning", async (c) => {
  const { topic, effort } = await c.req.json();
  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });

  const response = await openai.responses.create({
    model: "o4-mini",
    instructions: `You help plan educational lessons.
    The user will tell you they are trying to learn.
    Your job is to create a detailed list of prerequisite skills and information, the user should ensure they know.
    `,
    input: topic,
    reasoning: {
      effort, 
    },
  });
  return c.json({ response, outputText: response.output_text });
});

app.post("/api/examples/parse/relationships", async (c) => {
  const { text } = await c.req.json();

  const jsonSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "CharacterRelationshipGraph",
    type: "object",
    required: ["nodes", "edges"],
    properties: {
      nodes: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "label"],
          properties: {
            id: {
              type: "string",
              pattern: "^[a-z0-9_\\-]+$",
              description:
                "Unique machine-friendly identifier for the character",
            },
            label: {
              type: "string",
              description: "Human-readable name of the character",
            },
          },
          additionalProperties: false,
        },
      },
      edges: {
        type: "array",
        items: {
          type: "object",
          required: ["source", "target", "label", "type"],
          properties: {
            source: {
              type: "string",
              description: "ID of the source character (must match a node id)",
            },
            target: {
              type: "string",
              description: "ID of the target character (must match a node id)",
            },
            label: {
              type: "string",
              description: "Freeform description of the relationship",
            },
            type: {
              type: "string",
              enum: [
                "family",
                "friend",
                "professional",
                "romantic",
                "antagonist",
                "other",
              ],
              description:
                "Categorized relationship type for filtering or styling",
            },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  };

  const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY, baseURL: c.env.BASE_URL });

  const response = await openai.responses.parse({
    model: "gpt-4.1",
    input: text,
    text: {
      format: {
        type: "json_schema",
        name: "relationships",
        schema: jsonSchema,
      },
    },
  });
  return c.json(response.output_parsed);
});

export default app;
