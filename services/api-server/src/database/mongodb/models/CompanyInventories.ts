import { Connection, Document, Schema } from "mongoose";

export interface CompanyInventories extends Document {
  CompanyId: string;
  ProductName: string;
  ProductPrice: number;
  ProductQuantity: number;
  ProductImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyInventoriesSchema = new Schema<CompanyInventories>(
  {
    CompanyId: {
      required: true,
      type: String,
    },
    ProductName: {
      required: true,
      type: String,
      trim: true,
    },
    ProductPrice: {
      required: true,
      type: Number,
      min: 0,
      default: 0,
    },
    ProductQuantity: {
      required: true,
      type: Number,
      min: 0,
      default: 0,
    },
    ProductImage: {
      type: String,
      default: "null",
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  }
);

export const getCompanyInventoriesModel = (connection: Connection) => {
  return connection.model<CompanyInventories>(
    "Inventories",
    CompanyInventoriesSchema
  );
};
