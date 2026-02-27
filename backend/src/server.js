const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const connectDb = require("./config/db");

const port = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
});
