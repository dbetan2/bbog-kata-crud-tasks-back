import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request } from "express";
import * as OpenApiValidator from "express-openapi-validator";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import userRepo from "./repositories/userRepository";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

interface OpenApiError extends Error {
  status?: number;
  errors?: unknown[];
}

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

userRepo.createInitialUser().catch(console.error);

const openApiDocument = YAML.load(path.join(__dirname, "../openapi.yaml"));
console.warn('My open api document is', openApiDocument);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiDocument,
    validateRequests: true,
    validateResponses: true,
  })
);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err: OpenApiError, _req: Request, res: any, _next: NextFunction) => {
  if (err.status === 400) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }

  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});
