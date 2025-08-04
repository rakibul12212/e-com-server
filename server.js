const express = require("express");
const fs = require("fs").promises;
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce Server!");
});

// GET all products
app.get("/api/products", async (req, res, next) => {
  try {
    const path = require("path");
    const filePath = path.join(process.cwd(), "db.json");
    const data = await fs.readFile(filePath, "utf8");
    const database = JSON.parse(data);

    const allProducts = [];

    // Extract all products from all categories
    if (database.products && Array.isArray(database.products)) {
      database.products.forEach((category) => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((product) => {
            allProducts.push({
              ...product,
              category: category.category,
              categoryImg: category.categoryImg,
            });
          });
        }
      });
    }

    res.json(allProducts);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Failed to load products",
      message: err.message,
      code: err.code,
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
