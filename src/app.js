const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const csvRoutes = require("./routes/csvRoutes");

const app = express();
let reconnectInterval;

function connectToMongoDB() {
  mongoose
    .connect(
      "mongodb+srv://admin:6PwTdxkRFtdSise4@galash.ak3zn4h.mongodb.net/galash_JS",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log(
        "Conectado a MongoDB en",
        mongoose.connection.host,
        ":",
        mongoose.connection.port
      );
      clearInterval(reconnectInterval);
    })
    .catch((error) => {
      console.error("Error al conectar a MongoDB:", error.message);
      console.log("Intentando reconectar en 10 minutos...");

      reconnectInterval = setInterval(() => {
        connectToMongoDB();
      }, 10 * 60 * 1000);
    });
}

connectToMongoDB();


app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/csv", csvRoutes);

const PORT = 4000;

// Routes
app.use("/check", (req, res) => {
  res.send(`
  ╔══════════════════════════════════╗
  ║                                  
  ║  🚀 Servidor en ejecución 🚀     
  ║                                  
  ╚══════════════════════════════════╝
    `);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
