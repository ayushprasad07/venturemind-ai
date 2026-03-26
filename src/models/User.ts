import mongoose from "mongoose";

export interface IUser {
  name?: string;
  username?: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;       
  providerId?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: String,

    username: {
      type: String
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String
    },

    image: String,

    provider: {
      type: String,
      default: "credentials"
    },

    providerId: String,

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: {
        type: String
    },

    verificationTokenExpires: {
        type: Date
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;