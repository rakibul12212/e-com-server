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
    const data = await fs.readFile("db.json", "utf8");
    const products = JSON.parse(data);
    res.json(products);
  } catch (err) {
    next(err); 
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
