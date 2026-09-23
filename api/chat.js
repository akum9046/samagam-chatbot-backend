import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SAMAGAM_INFO = `
79th Annual Nirankari Sant Samagam

Verified information currently available:

Samagam Dates:
23 October 2026 to 26 October 2026

Guru Vandana:
27 October 2026

Venue:
Sant Nirankari Adhyatmik Sthal
G.T. Road
Samalkha
Haryana
India

IMPORTANT:
Do not invent train timings, bus schedules,
special train stoppages, accommodation details,
programme timings, parking arrangements,
contact numbers, or Mission announcements.

If information is not available in this verified
information section, clearly say it has not yet
been officially announced.
`;

export default async function handler(req, res) {

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

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

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const instructions = `
You are Samagam Sahayak, an information assistant
for the 79th Annual Nirankari Sant Samagam.

LANGUAGE:

- If the visitor writes in Hindi, reply in Hindi.
- If they write in English, reply in English.
- If they write in Hinglish, reply in simple Hinglish.
- Keep answers short, warm and easy to understand.

IMPORTANT RULE:

Use only the verified information supplied below.

Never invent or assume:
- Train timings
- Special train stoppages
- Bus schedules
- Shuttle services
- Accommodation
- Programme timings
- Parking information
- Contact numbers
- Official announcements

If information is unavailable, say that official
information has not yet been announced.

VERIFIED SAMAGAM INFORMATION:

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
      answer: response.output_text
    });

  } catch (error) {

    console.error(
      "Samagam chatbot error:",
      error
    );

    return res.status(500).json({
      error: "Chatbot request failed"
    });

  }
}
