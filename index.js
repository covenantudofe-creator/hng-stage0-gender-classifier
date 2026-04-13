const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());


app.get("/api/classify", async (req, res) => {
  try {
    const { name } = req.query;

    // ❌ Error: Missing name
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Name parameter is required"
      });
    }

    // ❌ Error: Not a string
    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Name must be a string"
      });
    }

    // Call Genderize API
    const response = await axios.get(
      `https://api.genderize.io/?name=${name}`
    );

    const data = response.data;

    // Process response
    const result = {
      status: "success",
      data: {
        name: data.name,
        gender: data.gender,
        probability: data.probability,
        sample_size: data.count,
        is_confident: data.probability > 0.8,
        processed_at: new Date().toISOString()
      }
    };

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server or external API error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});












