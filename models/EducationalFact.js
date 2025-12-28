import mongoose from "mongoose";

const educationalFactSchema = new mongoose.Schema(
  {
    // lat: { type: Number, required: true },
    // lon: { type: Number, required: true },

    title: { type: String, required: true },
    text: { type: String, required: true },

    // photoUrl: { type: String }, // optional

    // sliders 0–5
    sustainability: { type: Number, min: 0, max: 5, default: 3 },
    mentalHealth: { type: Number, min: 0, max: 5, default: 3 },
    fitness: { type: Number, min: 0, max: 5, default: 3 },
    community: { type: Number, min: 0, max: 5, default: 3 },

    // extra, optional
    // tags: [String],
    source: String,
    link: String,
    // radiusKm: { type: Number, default: 20 },
    // isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EducationalFact = mongoose.model("EducationalFact", educationalFactSchema);

export default EducationalFact;