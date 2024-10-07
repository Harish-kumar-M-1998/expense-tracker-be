const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

const app = express();
const corsOptions = {
  origin: 'https://expense-tracker-client-fe.netlify.app', // Allow your Netlify frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  credentials: true, // Allow credentials (if needed)
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://harishmano98:Harish%402024@harish-mongo.uf15eex.mongodb.net/Tour', )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
