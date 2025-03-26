const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    const { message, history } = req.body;
    
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an expert car mechanic diagnosing issues using only symptoms." },
                    ...history,
                    { role: "user", content: message }
                ],
                max_tokens: 100,
            },
            {
                headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
            }
        );

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: "Failed to fetch response." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
