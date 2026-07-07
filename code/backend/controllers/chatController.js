const { handleChatMessage } = require('../services/aiService');

exports.chat = async (req, res) => {
  const { message, conversationHistory, userId } = req.body;
  try {
    const reply = await handleChatMessage(message, conversationHistory, userId);
    res.json({ reply });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
};
