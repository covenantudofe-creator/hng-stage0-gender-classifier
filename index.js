const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// CORS
app.use(cors());

/* =========================
   ROUTE
========================= */
app.get("/api/classify", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Name parameter is required",
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Name must be a string",
      });
    }

    const response = await axios.get(
      `https://api.genderize.io?name=${name}`
    );

    const data = response.data;

    const result = {
      name: data.name,
      gender: data.gender,
      probability: data.probability,
      sample_size: data.count,
      is_confident: data.probability > 0.8,
      processed_at: new Date().toISOString(),
    };

    return res.status(200).json({
      status: "success",
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error or external API failed",
    });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});