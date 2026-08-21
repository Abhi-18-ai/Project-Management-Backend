import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

// Inbuilt middlewares configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173", //frontend link that allow and they are seperated by comma
    credentials:true,
    methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],//what are the operation you allow to perform on frontend
    allowedHeaders: ["Content-type","Authorization"]
  }),
);

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

// create routes
app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/projects",projectRouter)



export default app;
