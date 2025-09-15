import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },

    thumbnail: { type: String, required: true },
    descriptionImageOne: { type: String },
    descriptionImageTwo: { type: String },

    // New portfolio images
    portfolio1: { type: String },
    portfolio2: { type: String },
    portfolio3: { type: String },

    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },

    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
