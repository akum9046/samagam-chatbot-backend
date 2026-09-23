export default async function handler(req, res) {

  if (req.method === "OPTIONS") {

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

    return res.status(200).end();
  }


  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );


  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }


  const { message } = req.body || {};


  return res.status(200).json({

    answer:
      "Backend test successful. Your message was: " +
      message

  });

}
