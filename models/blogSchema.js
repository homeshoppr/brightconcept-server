import mongoose from "mongoose";

// Portfolio Schema (using Blog name)
const BlogSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
