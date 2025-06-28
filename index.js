import express from "express";
import routes from "./src/routes.js";
import connectDB from "./src/common/configs/database.js";
import cors from "cors";
import { HOST, PORT } from "./src/common/configs/environment.js";
import setupSwagger from "./src/common/configs/swagger-config.js";
import jsonValidator from "./src/common/middlewares/json-valid.middleware.js";
import notFoundHandler from "./src/common/middlewares/not-found.middleware.js";
import errorHandler from "./src/common/middlewares/error.middleware.js";

const app = express();
app.use(express.json());

connectDB();

app.use(cors());

setupSwagger(app);

app.use("/api", routes);

// Middleware xử lý JSON không hợp lệ
app.use(jsonValidator);

// Middleware xử lý route không tồn tại
app.use(notFoundHandler);

// Middleware xử lý lỗi chung
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}/api`);
  console.log(`Swagger Docs available at http://${HOST}:${PORT}/api-docs`);
});

// Middleware xử lý lỗi không xác định
process.on("unhandledRejection", (error, promise) => {
  console.error(`Error: ${error.message}`);
  server.close(() => process.exit(1));
});
