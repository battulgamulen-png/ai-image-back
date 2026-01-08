const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();

const { analyzeImage } = require("./routes/analyze");
const { recognitionText } = require("./routes/recognition");
const { generateFoodImage } = require("./routes/creator");
const { default: chatRouter } = require("./routes/chat");
const app = express();
app.use(express.json());

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.post("/analyze", upload.single("image"), analyzeImage);
app.post("/recognize", recognitionText);
app.post("/api/generate-food-image", generateFoodImage);
app.post("/chat", chatRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
