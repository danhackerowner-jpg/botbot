// Minimal Express backend to proxy Gemini 2.0 Flash requests (protect your API key)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = 'AIzaSyCiNqTIUd7lhBrO1wiuSmdKAfilKoHkAUI'; // <-- Put your Gemini 2.0 Flash API key here

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: messages.join('\n') }]
      }
    ]
  };
  try {
    const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    res.json({ reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response." });
  } catch (e) {
    res.status(500).json({ reply: "Error contacting Gemini API." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));