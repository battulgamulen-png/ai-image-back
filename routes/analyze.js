const { InferenceClient } = require("@huggingface/inference");
const dotenv = require("dotenv");

dotenv.config();

const analyzeImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Зураг байхгүй байна" });
  }

  try {
    const base64Image = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    const client = new InferenceClient(process.env.HF_TOKEN);

    const chatCompletion = await client.chatCompletion({
      model: "zai-org/GLM-4.6V-Flash:novita",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image in one sentence.",
            },
            {
              type: "image_url",
              image_url: {
                url: dataUri,
              },
            },
          ],
        },
      ],
    });

    const description =
      chatCompletion.choices?.[0]?.message?.content || "Тайлбар олдсонгүй";

    res.status(200).json({
      description,
      fullResponse: chatCompletion,
    });
  } catch (error) {
    console.error("Analyze error:", error.message || error);
    res.status(500).json({
      error: "Зургийг шинжлэхэд алдаа гарлаа",
      details: error.message || "Novita provider эсвэл HF_TOKEN шалгана уу",
    });
  }
};

module.exports = {
  analyzeImage,
};
