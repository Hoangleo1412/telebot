import { handleTelegramUpdate } from '../lib/handleUpdate.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await handleTelegramUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
