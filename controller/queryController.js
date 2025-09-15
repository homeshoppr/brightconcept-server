import { Query } from "../models/querySchema.js";

const createQuery = async (req, res) => {
    try {
        const { projectId, name, email, phone, message, projectName, sellerName, city, category, type, thumbnail } = req.body;

        if (!projectId || !name || !email || !phone || !message || !projectName || !sellerName || !city || !category || !type || !thumbnail) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const query = Query.create({
            projectId,
            name,
            email,
            phone,
            message,
            projectName,
            sellerName,
            city,
            category,
            type,
            thumbnail,
        });
        if (!query) {
            return res.status(500).json({ message: "Error creating query" });
        }
        res.status(201).json({query: query, message: "Query created successfully" });
    } catch (error) {
        console.error("Error creating query:", error);
        res.status(500).json({ message: "Error creating query", error: error.message });
    }
}

const getAllQueries = async (req, res) => {
    try {
        const queries = await Query.find().sort({ createdAt: -1 });
        if (!queries || queries.length === 0) {
            return res.status(404).json({ message: "No queries found" });
        }
        res.status(200).json(queries);
    } catch (error) {
        console.error("Error fetching queries:", error);
        res.status(500).json({ message: "Error fetching queries", error: error.message });
    }
}

const deleteQuery = async (req, res) => {
    try {
        const { queryId } = req.params;
        const query = await Query.findByIdAndDelete(queryId);
        res.status(200).json({ message: "Query deleted successfully" });
    } catch (error) {
        console.error("Error deleting query:", error);
        res.status(500).json({ message: "Error deleting query", error: error.message });
    }
}

export { createQuery, getAllQueries, deleteQuery };