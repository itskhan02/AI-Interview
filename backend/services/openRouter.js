import axios from "axios";

export const askAi = async (messages) => {
  try {
    if(!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Message array is empty');
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        models: [
          "openai/gpt-4o-mini",
          "google/gemini-2.5-flash",
          "deepseek/deepseek-chat",
        ],
        messages: messages,
        temperature: 0.6,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if(!content || !content.trim()){
      throw new Error('AI returned empty response');
    }

    return content;

  } catch (err) {
    console.error("OpenRouter request failed:", err.message || err);
    throw new Error("OpenRouter API Error");
  }
  
}
