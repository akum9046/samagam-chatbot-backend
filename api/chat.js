import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ALLOWED_ORIGINS = [
  "https://techpunjab.myshopify.com"
];

const SAMAGAM_INFO = `
79th Annual Nirankari Sant Samagam

Official currently available information:

Samagam Dates:
23 October 2026
24 October 2026
25 October 2026
26 October 2026

Guru Vandana:
27 October 2026

Venue:
Sant Nirankari Adhyatmik Sthal
G.T. Road
Samalkha
Haryana
India

Important rules:

- Do not invent train schedules.
- Do not invent transport details.
- Do not invent accommodation details.
- Do not invent programme timings.
- Do not invent parking details.
- Do not invent contact numbers.
- Do not invent Mission announcements.

If information is not available, clearly say that
the official information has not yet been provided.
`;

export default async function handler(req, res) {

  const origin = req.headers.origin;

  if (
    origin &&
    ALLOWED_ORIGINS.includes(origin)
  ) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      origin
    );
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      message,
      eventId,
      source
    } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const instructions = `
You are Samagam Sahayak, an information assistant
for the 79th Annual Nirankari Sant Samagam.

Your purpose is to provide simple and respectful
information to visitors.

LANGUAGE RULES:

1. If the user writes in Hindi, reply in Hindi.
2. If the user writes in English, reply in English.
3. If the user writes in Hinglish, reply in simple Hinglish.
4. Keep responses concise and easy to understand.

CONTENT RULES:

Only answer from the verified information below.

Never invent or assume:
- train timings
- special train stops
- bus schedules
- shuttle services
- programme timings
- accommodation arrangements
- parking
- phone numbers
- Mission announcements

If information is unavailable, say:

Hindi:
"यह जानकारी अभी आधिकारिक रूप से उपलब्ध नहीं है।
कृपया नवीनतम अपडेट के लिए दोबारा देखें।"

English:
"This information has not yet been officially announced.
Please check again for the latest update."

VERIFIED INFORMATION:

${SAMAGAM_INFO}
`;

    const response =
      await client.responses.create({
        model: "gpt-5",
        instructions,
        input: message,
        store: false
      });

    return res.status(200).json({
      answer: response.output_text,
      eventId,
      source
    });

  } catch (error) {

    console.error(
      "Samagam API Error:",
      error
    );

    return res.status(500).json({
      error: "Chatbot request failed"
    });
  }
}
