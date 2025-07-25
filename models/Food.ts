import mongoose, { Schema, Document, Model } from "mongoose";

interface FoodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  image: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: String },
    name: { type: String, require: true },
    description: { type: String, require: true },
    category: { type: String },
    foodType: { type: String, require: true },
    readyTime: { type: Number },
    price: { type: Number, require: true },
    rating: { type: Number },
    image: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Food = mongoose.model<FoodDoc>("food", FoodSchema);

export { Food };
