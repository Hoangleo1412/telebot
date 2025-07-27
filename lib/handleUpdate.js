const TELEGRAM_TOKEN = '8103465967:AAGLl_0lqcnVBVY9uwh4XeXM2wziKCyTaiw';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const N8N_WEBHOOK_URL = 'https://kimun0608.app.n8n.cloud/webhook-test/05a82975-4179-4411-aa33-0671f10d4eb7/webhook';

export async function handleTelegramUpdate(update) {
  const message = update.message || update.callback_query?.message;
  const chat_id = message.chat.id;

  if (update.message?.photo) {
    // Lưu file_id ảnh lớn nhất
    const file_id = update.message.photo.at(-1).file_id;
    await sendModelButtons(chat_id, file_id);
  }

  if (update.callback_query) {
    const model = update.callback_query.data.split('|')[0];
    const file_id = update.callback_query.data.split('|')[1];

    // Gửi đến webhook n8n
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, file_id, chat_id }),
    });

    // Phản hồi người dùng
    await sendMessage(chat_id, `🔄 Đang xử lý ảnh bằng model: ${model.toUpperCase()}...`);
  }
}

async function sendModelButtons(chat_id, file_id) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      text: '🧠 Chọn mô hình AI bạn muốn dùng để tạo lại ảnh:',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🤖 GPT-Image', callback_data: `gpt|${file_id}` },
            { text: '🎨 Google Image', callback_data: `google|${file_id}` }
          ]
        ]
      }
    }),
  });
}

async function sendMessage(chat_id, text) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text }),
  });
}
