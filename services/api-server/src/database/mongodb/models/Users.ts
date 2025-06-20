import { Document, model, Schema } from "mongoose";

export interface Users extends Document {
  email: string;
  password: string;
  companyName: string;
  createdAt: Date;
}

const UsersSchema = new Schema<Users>({
  email: {
    required: true,
    type: String,
    unique: true,
    trim: true,
  },
  companyName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});
const Users = model<Users>("Users", UsersSchema);
export default Users;
