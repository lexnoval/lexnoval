// models/Petition.ts
import mongoose, { Schema, model, models } from 'mongoose';

const PetitionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 190 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    // İsteğe bağlı metadata:
    ip: { type: String },
    ua: { type: String },
  },
  { timestamps: true }
);

// Aynı model iki kere tanımlanmasın:
export default models.Petition || model('Petition', PetitionSchema);
