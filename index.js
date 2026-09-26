const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = '8730914356:AAHqtDKAORwFUIg86jFKEA';

// Sizning Telegram ID raqamingiz:
const ADMIN_ID = 8339335717;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. Telegram Stars to'lov hisobini yaratish
app.post('/api/create-stars-invoice', async (req, res) => {
    try {
        const { title, description, starsPrice, payload } = req.body;
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            title: title,
            description: description,
            payload: payload,
            currency: 'XTR',
            prices: [{ label: title, amount: parseInt(starsPrice) }]
        });

        if (response.data.ok) {
            res.json({ success: true, invoiceLink: response.data.result });
        } else {
            res.status(400).json({ success: false, error: response.data.description });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// 2. Pul yechish so'rovi (sizning lichkangizga o'yinchining linkini yuboradi)
app.post('/api/withdraw', async (req, res) => {
    try {
        const { userId, username, amount } = req.body;

        // O'yinchining profil havolasi
        const userLink = username ? `@${username}` : `[O'yinchi profili](tg://user?id=${userId})`;

        const adminMessage = `🔔 *Yangi yechib olish so'rovi!*\n\n` +
                             `👤 *O'yinchi:* ${userLink}\n` +
                             `🆔 *ID:* \`${userId}\`\n` +
                             `💰 *Miqdor:* ${amount} ⭐ Stars\n\n` +
                             `👉 O'yinchiga Stars yuborish uchun yuqoridagi profilga bosing.`;

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: ADMIN_ID,
            text: adminMessage,
            parse_mode: 'Markdown'
        });

        res.json({ 
            success: true, 
            message: "So'rovingiz adminga yuborildi! Tez orada hisobingizga o'tkaziladi." 
        });
    } catch (e) {
        console.error("Yechishda xatolik:", e.message);
        res.status(500).json({ success: false, error: e.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
