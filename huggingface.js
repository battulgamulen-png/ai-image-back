import { InferenceClient } from "@huggingface/inference";

console.log(process.env.HF_TOKEN, "token");

const client = new InferenceClient(process.env.HF_TOKEN);

module.exports = client;
