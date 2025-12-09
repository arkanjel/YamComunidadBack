import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import beneficioRoutes from "./routes/beneficioRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import paginaRoutes from "./routes/paginaRoutes.js"
import siteMediaRoutes from "./routes/siteMediaRoutes.js"
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/beneficios", beneficioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/uploads", express.static("uploads"));
app.use("/api/clientes", clienteRoutes);
app.use("/api/paginas", paginaRoutes);
app.use("/api/sitemedia", siteMediaRoutes);

// Necesario para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir el build
app.use(express.static(path.join(__dirname, "public/dist")));

// TODAS las rutas del frontend vuelven a index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
console.log("Frontend servido en http://localhost:" + PORT)});

export default app;

