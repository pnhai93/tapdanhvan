const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 5000;

app.get("/test-api", async (req, res) => {
  try {
    const response = await fetch("/hmi/tts/v5", {
      method: "POST",
      headers: {
        "api-key": "d99iOxd7UIHqRPRX04zv8oDE6kLh2TUQ",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: "Xin chào" }),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "G?i API th?t b?i" });
  }
});

app.listen(PORT, () => console.log(`Server ch?y t?i http://localhost:${PORT}`));
