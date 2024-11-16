require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const connectDB = require("./db/connect")

const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Car Management API",
      version: "1.0.0",
      description: "API for managing cars",
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/users", authRoutes);
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};
start();
