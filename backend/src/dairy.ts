import mongoose from "mongoose";

const dairySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Dairy = mongoose.model("Dairy", dairySchema);

export default Dairy;
