const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/classify", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "name parameter is required",
      });
    }

    const response = await axios.get(
      `https://api.genderize.io?name=${name}`
    );

    const data = response.data;

    if (!data.gender || data.count === 0) {
      return res.status(404).json({
        status: "error",
        message: "No prediction available for the provided name",
      });
    }

    const sample_size = data.count;
    const probability = data.probability;

    const is_confident =
      probability >= 0.7 && sample_size >= 100;

    return res.status(200).json({
      status: "success",
      data: {
        name: data.name,
        gender: data.gender,
        probability,
        sample_size,
        is_confident,
        processed_at: new Date().toISOString(),
      },
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server or upstream failure",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});