import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//route import
import AuthRoutes from "./Routes/AuthRoutes";
import UserRoutes from "./Routes/UserRoutes";
import ProductRoutes from "./Routes/ProductRoutes";
import CartRoutes from "./Routes/CartRoutes";
import OrderRoutes from "./Routes/OrderRoutes";
import DriverRoutes from "./Routes/DriverRoutes";

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
server.use(cors());
server.use(express.json());

//initial route
server.get("/", (req, res) => {
  res.json({ message: "Welcome to Chow Pao POS Inventory System" });
});

server.use("/api/auth", AuthRoutes);
server.use("/api/user", UserRoutes);
server.use("/api/product", ProductRoutes);
server.use("/api/cart", CartRoutes);
server.use("/api/order", OrderRoutes);
server.use("/api/driver", DriverRoutes);

//error handler middleware
server.use(notFound);
server.use(errorHandler);
server.use(successHandler);

server.listen(PORT, () => {
  console.log(`Server is listening to http://localhost:${PORT}`);
});
