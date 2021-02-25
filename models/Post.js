const { model, Schema } = require("mongoose");
const PostSchema = new Schema(
  {
    postHead: {
      type: String,
      require: true,
    },
    postBody: {
      type: String,
      require: true,
    },
    Author: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", PostSchema);
