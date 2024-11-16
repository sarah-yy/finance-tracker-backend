import cors from "cors";
import express from "express";

const app = express();

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Insert routes here

app.get("/ping", (req, res) => {
  res.json({ message: "Application up and running!" });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080!");
});