/**
 * Organizer-specific Gemini endpoints.
 * These are non-streaming (JSON response) since they generate short outputs
 * from structured mock data — not conversational chat.
 */
import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { gates, foodCourts, transportOptions, emergencyPoints } from "../../data/stadiumData.js";

const router = Router();

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey });
}

// POST /gemini/organizer/summary
// Generates an AI operational summary from mock analytics metrics.
router.post("/gemini/organizer/summary", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Gemini API key not configured" });
    return;
  }

  try {
    const ai = getAIClient();

    // Build a structured data block from mock metrics + live stadium data
    // The metrics come from the request body (from the organizer dashboard)
    const metrics = req.body.metrics as Record<string, string | number> | undefined;

    const metricsText = metrics
      ? Object.entries(metrics)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join('\n')
      : `- Crowd Density: 87% capacity
- Medical Incidents: 3 active, 12 resolved
- Volunteers Active: 1847 of 2000
- Food Queue Average: 8.2 minutes
- Security Alerts: 2 high priority
- Transport Status: 94% on-time
- Waste Collection: 73% bin capacity
- Emergency Requests: 0 critical`;

    // Build context from live mock data
    const gateStatus = gates
      .map((g) => `${g.name}: crowd=${g.crowdLevel}, open=${g.openStatus}`)
      .join('; ');
    const transportStatus = transportOptions
      .filter((t) => t.status !== 'on-time')
      .map((t) => `${t.name} (${t.status}, +${t.waitTime}min)`)
      .join(', ') || 'all on-time';
    const foodIssues = foodCourts
      .filter((f) => f.queueTime > 15 && f.isOpen)
      .map((f) => `${f.name} (${f.queueTime}min)`)
      .join(', ') || 'none';
    const openEmergencyPoints = emergencyPoints.filter((e) => e.staffed).length;

    const prompt = `You are the ArenaOS AI for an event organizer at FIFA World Cup 2026, Lusail International Stadium.

Generate a concise executive operational summary (3-4 sentences) followed by exactly 3 prioritised action recommendations.

CURRENT METRICS:
${metricsText}

LIVE STADIUM DATA:
- Gate crowd status: ${gateStatus}
- Transport issues: ${transportStatus}
- High food queue courts: ${foodIssues}
- Staffed emergency points active: ${openEmergencyPoints}/${emergencyPoints.length}

FORMAT YOUR RESPONSE EXACTLY AS:
SUMMARY: [3-4 sentence operational summary]
RECOMMENDATIONS:
1. [Most urgent action]
2. [Second priority action]
3. [Third priority action]

Keep each recommendation under 15 words. Be direct and operational. Note data is simulated. Do not use emojis.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } },
    });

    const text = response.text ?? "";

    // Parse summary and recommendations from structured response
    const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(?=RECOMMENDATIONS:|$)/i);
    const recsSection = text.match(/RECOMMENDATIONS:\s*([\s\S]*)/i);

    const summary = summaryMatch ? summaryMatch[1].trim() : text.trim();
    const recommendations: string[] = [];

    if (recsSection) {
      const lines = recsSection[1].split('\n').filter((l) => l.trim());
      for (const line of lines) {
        const match = line.match(/^\d+\.\s*(.+)/);
        if (match) recommendations.push(match[1].trim());
      }
    }

    res.json({ summary, recommendations, raw: text });
  } catch (err) {
    req.log.error({ err }, "Organizer summary generation failed");
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

// POST /gemini/organizer/announcement
// Generates a professional public stadium announcement from a brief situation description.
router.post("/gemini/organizer/announcement", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Gemini API key not configured" });
    return;
  }

  const { situation, language } = req.body as { situation: string; language?: string };
  if (!situation || typeof situation !== "string") {
    res.status(400).json({ error: "situation is required" });
    return;
  }

  try {
    const ai = getAIClient();

    const langInstruction = language && language !== 'English'
      ? `\nWrite the announcement in ${language}. Keep it professional and clear in ${language}.`
      : '';

    const prompt = `You are the public address system AI for FIFA World Cup 2026 at Lusail International Stadium.

Generate a professional, calm public announcement based on this situation:
"${situation}"

REQUIREMENTS:
- Start with "ATTENTION STADIUM GUESTS:" 
- Keep it under 80 words
- Tone: calm, clear, authoritative — never alarmist
- Include the stadium name: Lusail International Stadium
- End with a specific call-to-action
- Do not use emojis${langInstruction}

Generate the announcement only — no preamble, no explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } },
    });

    const announcement = response.text?.trim() ?? "";
    res.json({ announcement, language: language ?? "English" });
  } catch (err) {
    req.log.error({ err }, "Announcement generation failed");
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
