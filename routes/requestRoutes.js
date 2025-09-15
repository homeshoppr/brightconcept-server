import { Router } from "express";
import { createRequest, getAllRequests, getRequest, updateRequest, deleteRequest } from "../controller/requestController.js";

const requestRoutes = Router();

requestRoutes.post("/create", createRequest);
requestRoutes.get("/all", getAllRequests);
requestRoutes.get("/get/:requestId", getRequest);
requestRoutes.patch("/update/:requestId", updateRequest);
requestRoutes.delete("/delete/:requestId", deleteRequest);

export default requestRoutes;