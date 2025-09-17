import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Connection } from "./Databse/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./routes/Routes.js";
import LoginRoutes from "./routes/LoginRoute.js";
import adminRoutes from "./routes/adminroutes.js"
import EmployeeRoutes from "./routes/UserRoutes.js";
import createblogs from './routes/blogRoutes.js';
import projectRouter from "./routes/projectRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import requestRouter from "./routes/requestRoutes.js";
import authRouter from "./routes/authRoutes.js";
import countRoutes from "./routes/countRoutes.js";

// import blogRoutes from './routes/blogRoutes.js';
import Typecategory from './routes/Typeroute.js';

dotenv.config();
const app = express();



const Port = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cookieParser());

app.use("/", Routes);
app.use("/api/user/", EmployeeRoutes);
app.use("/api/", Typecategory);
app.use("/api/admin/", adminRoutes);
app.use("/api/", createblogs);
app.use("/api/userLogin/", LoginRoutes);
app.use("/api/project/", projectRouter);
app.use("/api/query", queryRoutes);
app.use("/api/request", requestRouter);
app.use("/api/auth", authRouter);
app.use("/api/count", countRoutes);





Connection();

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
