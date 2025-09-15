import mongoose, { Schema } from "mongoose";

const querySchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        message: {
            type: String,
        },
        projectName: {
            type: String,
        },
        sellerName: {
            type: String,
        },
        city: {
            type: String,
        },
        city: {
            type: String,
        },
        category: {
            type: String,
        },
        type: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

export const Query = mongoose.model("Query", querySchema);