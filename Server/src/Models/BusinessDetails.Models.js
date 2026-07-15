import mongoose from "mongoose";

const BusinessDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    taxId: {
      type: String,
      default: "",
    },
    regNumber: {
      type: String,
      default: "",
    },
    legalName: {
      type: String,
      default: "",
    },
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const BusinessDetails =
  mongoose.models.BusinessDetails ||
  mongoose.model("BusinessDetails", BusinessDetailsSchema);

export default BusinessDetails;
