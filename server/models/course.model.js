import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    subTitle: { type: String },
    description: { type: String },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Medium", "Advance"],
    },
    coursePrice: {
      type: Number,
      min: 0,
    },
    courseThumbnail: {
      type: String,
    },
    enrolledStudent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("course", courseSchema);
