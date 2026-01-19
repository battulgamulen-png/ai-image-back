const { InferenceClient } = require("@huggingface/inference");
const client = new InferenceClient(process.env.HF_TOKEN);

async function recognitionText(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Prompt is required" });
    }

    const chatCompletion = await client.chatCompletion({
      model: "MiniMaxAI/MiniMax-M2.1:novita",
      messages: [
        { role: "system", content: "You are a helpful AI content creator." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    // console.log("Chat completion response:", chatCompletion);

    const result = chatCompletion?.choices?.[0]?.message?.content;

    if (!result) {
      return res.status(200).json({ success: true, data: "" }); // return empty string instead of 500
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("recognitionText error:", error);
    res.status(500).json({ success: false, error: "Text generation failed" });
  }
}

module.exports = { recognitionText };
