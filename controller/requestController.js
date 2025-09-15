import { Request } from "../models/requestSchema.js";

const createRequest = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newRequest = Request.create({ name, email, phone, message });
        return res.status(201).json({ message: "Request created successfully" });
    } catch (error) {
        console.error("Error creating request:", error);
        return res.status(500).json({ message: "Error creating request", error: error.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: "No requests found" });
        }
        return res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        return res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

const getRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        return res.status(200).json(request);
    } catch (error) {
        console.error("Error fetching request:", error);
        return res.status(500).json({ message: "Error fetching request", error: error.message });
    }
};

const updateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const value = req.body;
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        const fieldsToUpdate = ["name", "email", "phone", "message", "status"];
        let hasUpdates = false;
        fieldsToUpdate.forEach((field) => {
            if (value[field] !== undefined && value[field] !== request[field]) {
              request[field] = value[field];
              hasUpdates = true;
            }
          });
        if (!hasUpdates) {
            return res.status(400).json({ message: "No updates provided" });
        }
        await request.save();
        return res.status(200).json({ message: "Request updated successfully" });
    } catch (error) {
        console.error("Error updating request:", error);
        return res.status(500).json({ message: "Error updating request", error: error.message });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findByIdAndDelete(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        return res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        console.error("Error deleting request:", error);
        return res.status(500).json({ message: "Error deleting request", error: error.message });
    }
};

export { createRequest, getAllRequests, getRequest, updateRequest, deleteRequest };