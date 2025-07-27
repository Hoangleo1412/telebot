
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Failed to parse form' });
    }

    const { chat_id, model, style, instructions } = fields;
    const image = files.image;

    if (!image || !chat_id || !model) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const imageBuffer = fs.readFileSync(image.filepath);

    const formData = new FormData();
    formData.append('chat_id', chat_id);
    formData.append('model', model);
    formData.append('style', style);
    formData.append('instructions', instructions);
    formData.append('image', new Blob([imageBuffer]), image.originalFilename);

    const webhookUrl = 'https://kimun0608.app.n8n.cloud/webhook-test/05a82975-4179-4411-aa33-0671f10d4eb7/webhook';

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      res.status(200).json({ success: true });
    } catch (e) {
      console.error('Webhook POST failed:', e);
      res.status(500).json({ error: 'Failed to send to webhook' });
    }
  });
}
