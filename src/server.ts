import express from "express";
import dotenv from "dotenv";

//route import
import AuthRoutes from "./Routes/AuthRoutes";
import UserRoutes from "./Routes/UserRoutes";
import ProductRoutes from "./Routes/ProductRoutes";

//error handler midddlewares
import {
  errorHandler,
  successHandler,
  notFound,
} from "./Middleware/ErrorHandler";

const server = express();
dotenv.config();
const PORT = process.env.PORT;

//middlewares
server.use(express.json());

//initial route
server.get("/", (req, res) => {
  throw new Error("Hello world");
});

server.use("/api/auth", AuthRoutes);
server.use("/api/user", UserRoutes);
server.use("/api/product", ProductRoutes);

//error handler middleware
server.use(notFound);
server.use(errorHandler);
server.use(successHandler);

server.listen(PORT, () => {
  console.log(`Server is listening to http://localhost:${PORT}`);
});
