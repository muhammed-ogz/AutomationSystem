import { Schema, model } from "mongoose";

export interface Revenues extends Document {
  CompanyId: string;
  TotalProducts: number;
  TotalPrice: number;
  TotalIncome: number;
}

const RevenuesSchema = new Schema<Revenues>({
  CompanyId: {
    required: true,
    type: String,
  },
  TotalProducts: {
    required: true,
    type: Number,
    trim: true,
    default: 0,
  },
  TotalPrice: {
    required: true,
    type: Number,
    trim: true,
    default: 0,
  },
  TotalIncome: {
    required: true,
    type: Number,
    trim: true,
    default: 0,
  },
});

const Revenues = model<Revenues>("Revenues", RevenuesSchema);
export default Revenues;
