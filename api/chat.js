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

Information not yet available in this knowledge base:

- Train schedules
- Special train stoppages
- Bus schedules
- Shuttle schedules
- Accommodation arrangements
- Detailed programme timings
- Parking arrangements
- Helpline numbers
- Other operational announcements

Never invent unavailable information.
`;


export default async function handler(req, res) {

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


  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }


  /*
   * Browser health check
   */
  if (req.method === "GET") {

    return res.status(200).json({
      status: "success",
      backend: "Gemini REST",
      geminiKeyConfigured:
        Boolean(process.env.GEMINI_API_KEY)
    });

  }


  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }


  /*
   * Check API key before doing anything else
   */
  const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;


  if (!GEMINI_API_KEY) {

    console.error(
      "GEMINI_API_KEY is missing in Vercel"
    );

    return res.status(500).json({
      error:
        "GEMINI_API_KEY is not configured"
    });

  }


  try {

    const { message } =
      req.body || {};


    if (
      !message ||
      typeof message !== "string"
    ) {

      return res.status(400).json({
        error: "Message is required"
      });

    }


    const systemInstruction = `
You are Samagam Sahayak,
an information assistant for the
79th Annual Nirankari Sant Samagam.

LANGUAGE:

- Hindi question → answer in Hindi.
- English question → answer in English.
- Hinglish question → answer in simple Hinglish.

Keep answers short, respectful,
clear and easy to understand.

You may use:
"धन निरंकार जी 🙏"
or
"Dhan Nirankar Ji 🙏"

IMPORTANT:

Use ONLY the verified Samagam
information supplied below.

Never invent:

- train numbers
- train timings
- railway stoppages
- buses
- shuttle timings
- accommodation
- programme timings
- parking
- contact numbers
- Mission announcements

If requested information is unavailable,
clearly say that official information has
not yet been added.

VERIFIED INFORMATION:

${SAMAGAM_INFO}
`;


    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";


    const geminiResponse =
      await fetch(url, {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-goog-api-key":
            GEMINI_API_KEY

        },

        body: JSON.stringify({

          system_instruction: {

            parts: [
              {
                text:
                  systemInstruction
              }
            ]

          },

          contents: [
            {

              role: "user",

              parts: [
                {
                  text: message
                }
              ]

            }
          ],

          generationConfig: {

            temperature: 0.2,

            maxOutputTokens: 400

          }

        })

      });


    const data =
      await geminiResponse.json();


    /*
     * Log Google's actual response
     * if something fails.
     */
    if (!geminiResponse.ok) {

      console.error(
        "Gemini API error:",
        JSON.stringify(data)
      );

      return res
        .status(geminiResponse.status)
        .json({

          error:
            "Gemini API request failed",

          details:
            data?.error?.message ||
            "Unknown Gemini error"

        });

    }


    const answer =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;


    if (!answer) {

      console.error(
        "Gemini returned no answer:",
        JSON.stringify(data)
      );

      return res.status(500).json({
        error:
          "Gemini returned no answer"
      });

    }


    return res.status(200).json({

      status: "success",

      answer: answer

    });


  } catch (error) {

    console.error(
      "Samagam Gemini REST error:",
      error
    );


    return res.status(500).json({

      status: "error",

      error:
        "Chatbot request failed"

    });

  }

}
