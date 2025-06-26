export const ColletionSchemas = {
  products: [
    {
      key: "productName",
      type: String,
      required: true,
    },
    {
      key: "productBarcode",
      type: String,
      required: true,
      unique: true,
    },
    {
      key: "productPrice",
      type: Number,
      required: true,
      default: 0,
    },
    {
      key: "productQuantity",
      type: Number,
      required: true,
      default: 0,
    },
    {
      key: "productImage",
      type: String,
      required: true,
    },
  ],
  Statistics: [
    {
      key: "totalProducts",
      type: Number,
      required: true,
      default: 0,
    },
    {
      key: "totalPrice",
      type: Number,
      required: true,
      default: 0,
    },
    {
      key: "totalReturns",
      type: Number,
      required: true,
      default: 0,
    },
  ],
  Revenues: [
    {
      key: "totalProducts",
      type: Number,
      required: true,
      default: 0,
    },
    {
      key: "totalPrice",
      type: Number,
      required: true,
      default: 0,
    },
    {
      key: "totalIncome",
      type: Number,
      required: true,
      default: 0,
    },
  ],
};
