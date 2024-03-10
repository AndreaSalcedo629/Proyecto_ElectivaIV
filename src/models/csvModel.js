const mongoose = require("mongoose");

const csvSchema = new mongoose.Schema({
    data: [
      {
        title: String,
        description: String,
        reach: Number,
        interactions: Number,
        shares: Number,
        likes: Number,
        comments: Number,
      },
    ],
  });

module.exports = mongoose.model("CSV", csvSchema);
