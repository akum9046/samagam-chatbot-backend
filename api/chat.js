import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const SAMAGAM_INFO = `
79th Annual Nirankari Sant Samagam

VERIFIED INFORMATION:

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

The following information is NOT yet available
in this knowledge base:

- Train schedules
- Special train stoppages
- Shuttle schedules
- Bus schedules
- Accommodation arrangements
- Detailed programme timings
- Parking arrangements
- Helpline numbers
- Other operational announcements

Do not invent any unavailable information.
`;

export default async function handler(req, res) {

  /*
   * CORS
   */

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  /*
   * OPTIONS
   */

  if (req.method === "OPTIONS") {

    return res
      .status(200)
      .end();

  }


  /*
   * Simple browser health check
   */

  if (req.method === "GET") {

    return res
      .status(200)
      .json({
        status: "success",
        message:
          "Samagam chatbot Gemini backend is working"
      });

  }


  /*
   * Only POST after this point
   */

  if (req.method !== "POST") {

    return res
      .status(405)
      .json({
        error: "Method not allowed"
      });

  }


  try {

    const { message } =
      req.body || {};


    if (
      !message ||
      typeof message !== "string"
    ) {

      return res
        .status(400)
        .json({
          error:
            "Message is required"
        });

    }


    const systemInstruction = `
You are "Samagam Sahayak", a helpful information
assistant for the 79th Annual Nirankari Sant Samagam.

Your purpose is to help devotees and visitors
understand officially supplied Samagam information.

LANGUAGE RULES:

1. If the visitor writes in Hindi, reply in Hindi.

2. If the visitor writes in English, reply in English.

3. If the visitor writes in Hinglish, reply in
   simple natural Hinglish.

4. Keep responses concise, clear, respectful
   and easy to understand.

5. You may begin the first relevant response with:
   "धन निरंकार जी 🙏"
   or
   "Dhan Nirankar Ji 🙏"

INFORMATION RULES:

You must only use the VERIFIED INFORMATION below
for factual Samagam information.

Do NOT invent, assume, estimate or fabricate:

- train numbers
- train timings
- railway stoppages
- bus timings
- shuttle timings
- accommodation
- programme timings
- parking
- phone numbers
- official announcements

If the requested information is not present,
say clearly that the official information has
not yet been added or announced.

Do not pretend that unavailable information
has been confirmed.

VERIFIED INFORMATION:

${SAMAGAM_INFO}
`;


    const response =
      await ai.models.generateContent({

        model:
          "gemini-3.8-flash",

        contents:
          message,

        config: {

          systemInstruction:
            systemInstruction,

          temperature: 0.2,

          maxOutputTokens: 400

        }

      });


    const answer =
      response.text;


    if (!answer) {

      throw new Error(
        "Gemini returned an empty response"
      );

    }


    return res
      .status(200)
      .json({
        status: "success",
        answer: answer
      });


  } catch (error) {

    console.error(
      "Samagam Gemini error:",
      error
    );


    return res
      .status(500)
      .json({
        status: "error",
        error:
          "Gemini chatbot request failed"
      });

  }

}
