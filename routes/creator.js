const { InferenceClient } = require("@huggingface/inference");
const dotenv = require("dotenv");
dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN);

const generateFoodImage = async (req, res) => {
  const { prompt, style = "realistic" } = req.body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt шаардлагатай" });
  }

  try {
    const fullPrompt = `${prompt}, ${style} style, high quality food photography, appetizing, professional lighting, ultra detailed`;

    const response = await client.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: fullPrompt,
      parameters: {
        num_inference_steps: 25,
        guidance_scale: 7.5,
        width: 1024,
        height: 1024,
      },
    });

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    res.status(200).json({
      imageUrl: `data:image/png;base64,${base64Image}`,
      message: "Зураг амжилттай үүслээ",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({
      error: "Зураг үүсгэхэд алдаа гарлаа",
      details: error.message,
    });
  }
};

module.exports = { generateFoodImage };
