import { Schema, model } from "mongoose";

export interface Statistics extends Document {
  CompanyId: string;
  TotalProducts: number;
  TotalPrice: number;
  TotalReturns: number;
}

const StatisticsSchema = new Schema<Statistics>({
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
  TotalReturns: {
    required: true,
    type: Number,
    trim: true,
    default: 0,
  },
});
const Statistics = model<Statistics>("Statistics", StatisticsSchema);
export default Statistics;
