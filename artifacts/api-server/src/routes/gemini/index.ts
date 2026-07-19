import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { retrieveContext } from "../../data/contextRetrieval.js";
import { buildSystemPrompt } from "./systemPrompt.js";

const router = Router();

// Lazy Gemini client — fails gracefully if key is missing
function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

// GET /gemini/conversations
router.get("/gemini/conversations", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(conversations)
      .orderBy(conversations.createdAt);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

// POST /gemini/conversations
router.post("/gemini/conversations", async (req, res) => {
  try {
    const { title } = req.body as { title: string };
    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "title is required" });
      return;
    }
    const [conv] = await db
      .insert(conversations)
      .values({ title })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// GET /gemini/conversations/:id
router.get("/gemini/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    if (!conv) { res.status(404).json({ error: "Conversation not found" }); return; }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);

    res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

// DELETE /gemini/conversations/:id
router.delete("/gemini/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const [deleted] = await db
      .delete(conversations)
      .where(eq(conversations.id, id))
      .returning();
    if (!deleted) { res.status(404).json({ error: "Conversation not found" }); return; }

    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// GET /gemini/conversations/:id/messages
router.get("/gemini/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);

    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

// POST /gemini/conversations/:id/messages  — SSE streaming
router.post("/gemini/conversations/:id/messages", async (req, res) => {
  const convId = parseInt(req.params.id, 10);
  if (isNaN(convId)) {
    res.status(400).json({ error: "Invalid conversation id" });
    return;
  }

  const { content, arenaRole, arenaFeature, selectedLanguage } = req.body as {
    content: string;
    arenaRole?: string;
    arenaFeature?: string;
    selectedLanguage?: string;
  };

  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "content is required" });
    return;
  }

  // Validate conversation exists
  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, convId));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Check Gemini key before starting SSE (so we can return JSON error)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Gemini API key not configured" });
    return;
  }

  // Persist user message
  await db.insert(messages).values({
    conversationId: convId,
    role: "user",
    content,
  });

  // --- Structured context retrieval ---
  // Filter mock data based on keywords + active feature; log the selection
  const contextBlocks = retrieveContext(content, arenaFeature);
  req.log.info(
    { labels: contextBlocks.map((c) => c.label) },
    "ArenaOS context retrieval selected"
  );

  // Build role-aware, feature-aware, multilingual system prompt
  const systemPrompt = buildSystemPrompt(arenaRole, contextBlocks.map((c) => c.data), arenaFeature, selectedLanguage);

  // Load prior messages for multi-turn history
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, convId))
    .orderBy(messages.createdAt);

  // Build Gemini content array (map assistant→model, skip the user msg we just inserted)
  const priorMessages = history.slice(0, -1); // exclude the message we just saved
  const geminiContents = [
    ...priorMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : ("user" as "model" | "user"),
      parts: [{ text: m.content }],
    })),
    { role: "user" as const, parts: [{ text: content }] },
  ];

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  let fullResponse = "";

  try {
    const ai = getAIClient();
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 8192,
      },
      contents: geminiContents,
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    // Persist assistant response
    await db.insert(messages).values({
      conversationId: convId,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    req.log.error({ err }, "Gemini streaming error");
    const message =
      err instanceof Error ? err.message : "Unknown error from Gemini";
    // Send error over SSE so the client can display it
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
