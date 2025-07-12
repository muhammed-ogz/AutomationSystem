import { Connection, Schema } from "mongoose";

export interface Statistics extends Document {
  CompanyId: string;
  TotalProducts: number;
  TotalPrice: number;
  TotalReturns: number;
}

const StatisticsSchema = new Schema<Statistics>(
  {
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
  },
  {
    timestamps: true,
  }
);
export const getStatisticsModel = (connection: Connection) => {
  return connection.model<Statistics>("Statistics", StatisticsSchema);
};
