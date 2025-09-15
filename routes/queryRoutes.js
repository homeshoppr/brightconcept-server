import { createQuery, getAllQueries, deleteQuery } from "../controller/queryController.js";
import { Router } from "express";

const queryRoutes = Router();

queryRoutes.post("/create", createQuery);
queryRoutes.get("/get/all", getAllQueries);
queryRoutes.delete("/delete/:queryId", deleteQuery);

export default queryRoutes;