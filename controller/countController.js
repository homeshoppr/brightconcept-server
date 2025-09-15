import Project from "../models/projectSchema.js";
import Blog from "../models/blogSchema.js";
import { Query } from "../models/querySchema.js";
import { User } from "../models/userSchema.js";

const count = async (req, res) => {
    try {
        const projectCount = await Project.countDocuments();
        const pendingProjectCount = await Project.countDocuments({ status: "Pending" });
        const approvedProjectCount = await Project.countDocuments({ status: "Approved" });
        const blogCount = await Blog.countDocuments();
        const queryCount = await Query.countDocuments();
        const userCount = await User.countDocuments();
        return res.status(200).json({ projectCount, pendingProjectCount, approvedProjectCount, blogCount, queryCount, userCount });
    } catch (error) {
        console.error("Error counting documents:", error);
        return res.status(500).json({ message: "Error counting documents", error: error.message });
    }
}

export { count }