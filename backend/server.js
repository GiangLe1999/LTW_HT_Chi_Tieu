const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
// Parse (chuyển đổi) dữ liệu JSON từ request body thành object JavaScript
app.use(express.json());

// Routes
// Mọi request bắt đầu bằng /api/auth sẽ được chuyển vào file ./routes/authRoutes để xử lý
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/debts", require("./routes/debtRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
// Giúp không crash server khi throw lỗi
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Khởi động server tại cổng 5000 và lắng nghe request từ client
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
