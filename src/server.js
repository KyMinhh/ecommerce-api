require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
