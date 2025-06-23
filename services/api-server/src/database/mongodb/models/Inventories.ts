import { Document, model, Schema } from "mongoose";

export interface Inventories extends Document {
  CompanyId: string;
  ProductName: string;
  ProductPrice: number;
  ProductQuantity: number;
  ProductImage: string;
}

const InventoriesSchema = new Schema<Inventories>({
  CompanyId: {
    required: true,
    type: String,
  },
  ProductName: {
    required: true,
    type: String,
  },
  ProductPrice: {
    required: true,
    type: Number,
    trim: true,
    default: 0,
  },
  ProductQuantity: {
    required: true,
    type: Number,
    trim: true,
    default: 0,
  },
  ProductImage: {
    type: String,
    default: "null",
  },
});

const Inventories = model<Inventories>("Inventories", InventoriesSchema);
export default Inventories;
