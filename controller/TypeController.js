import CategoryType from '../models/TypeSchema.js';

// Function to handle adding new type data
export const TypeFunc = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ success: false, message: "Please provide both 'name' and 'type' fields." });
        }

        // Check if the combination of name and type already exists
        const existsData = await CategoryType.findOne({ name });

        if (existsData) {
            return res.status(400).json({ success: false, message: "A record with the same 'name' and 'type' already exists." });
        }

        // Save new data
        const finalData = new CategoryType({ name });
        await finalData.save();

        return res.status(201).json({ success: true, message: "Data saved successfully.", data: finalData });
    } catch (error) {
        // Handle server errors
        console.error("Error in TypeFunc:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred.", error: error.message });
    }
};

// Function to get all type data
export const GetAlltypeFunc = async (req, res) => {
    try {
        const result = await CategoryType.find({});
        
        if (result && result.length > 0) {
            return res.status(200).json({ success: true, message: "Data found.", result });
        } else {
            return res.status(404).json({ success: false, message: "No data found." });
        }

    } catch (error) {
        console.error("Error in GetAlltypeFunc:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};


export const Typedeletefunc = async (req,res)=>{
    const {id} = req.params
    try {
         await CategoryType.deleteOne({_id : id})
       return res.status(201).json({message:'Data delted Successfully'});
    } catch (error) {
      return  res.status(400).json({message:'data not deleted'});
    }
}