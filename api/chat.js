module.exports = function handler(req, res) {

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

    return res
      .status(200)
      .end();

  }


  if (req.method === "GET") {

    return res
      .status(200)
      .json({
        status: "success",
        message: "Samagam chatbot backend is working"
      });

  }


  if (req.method === "POST") {

    const message =
      req.body?.message || "No message received";


    return res
      .status(200)
      .json({
        status: "success",
        answer:
          "Backend test successful. Your message was: " +
          message
      });

  }


  return res
    .status(405)
    .json({
      error: "Method not allowed"
    });

};
