const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use((req, res, next) => {
  console.log('Middleware berjalan');
  next();
});

const db = require("./app/models");

app.use(cors())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to inventory application." });
});

// Define routes for both barang and supplier before syncing the models
require("./app.js")(app);


// Sync models with database after defining routes
db.sequelize.sync({ force: true }).then(() => {
  console.log("All models synchronized with database.");
  // Start the server after synchronization
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error('Error synchronizing models:', err);
});
