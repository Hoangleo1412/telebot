const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  const body = req.body;
  const chat_id = body.message?.chat?.id;
  const caption = body.message?.caption || '';
  const photos = body.message?.photo;
  const file_id = photos ? photos[photos.length - 1].file_id : null;

  if (!chat_id || !file_id) {
    return res.status(400).send('Missing data');
  }

  // Default to Gemini
  const model = caption.toLowerCase().includes('[gpt]') ? 'gpt' : 'gemini';

  try {
    await axios.post(process.env.N8N_WEBHOOK_URL, {
      chat_id,
      file_id,
      caption,
      model
    });

    return res.status(200).send('Forwarded to n8n');
  } catch (error) {
    console.error('n8n error:', error.response?.data || error.message);
    return res.status(500).send('Failed to forward to n8n');
  }
};
