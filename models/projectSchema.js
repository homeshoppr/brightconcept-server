import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        sellerName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        projectName: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        descriptionImage: {
            type: String,
        },
        propertyImageOne: {
            type: String,
        },
        propertyImageTwo: {
            type: String,
        },
        propertyImageThree: {
            type: String,
        },
        propertyImageFour: {
            type: String,
        },
        category: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        size: {
            type: String,
        },
        status: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Project = mongoose.model("Project", projectSchema);

export default Project