import { Router } from "express";
import { count } from "../controller/countController.js";

const countRoutes = Router();

countRoutes.get("/", count);

export default countRoutes;