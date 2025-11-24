import mongoose from "mongoose";

const siteMediaSchema = new mongoose.Schema({
  videoHero: { type: String, required: true },
  videoBienvenida: { type: String, required: true },
  imagen: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

export default mongoose.model("SiteMedia", siteMediaSchema);
