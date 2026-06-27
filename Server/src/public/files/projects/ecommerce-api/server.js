const express = require("express");
const app = express();
app.use(express.json());
app.get("/api/products", (req, res) => {
  res.json([{ id: 1, name: "Premium Laptop", price: 1299 }]);
});
app.listen(8000, () => console.log("E-commerce API listening on port 8000"));