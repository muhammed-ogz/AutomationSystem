import { Document, model, Schema } from "mongoose";

export interface Users extends Document {
  email: string;
  phoneNumber?: string;
  password: string;
  companyId: string;
  companyName: string;
  avatar: string;
  smsNotification: boolean;
  emailNotification: boolean;
  createdAt: Date;
}

const UsersSchema = new Schema<Users>({
  email: {
    required: true,
    type: String,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
  },
  companyId: {
    required: true,
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  companyName: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  smsNotification: {
    type: Boolean,
    default: false,
  },
  emailNotification: {
    type: Boolean,
    default: false,
  },
});

const Users = model<Users>("Users", UsersSchema);
export default Users;
