import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import beneficioRoutes from "./routes/beneficioRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import paginaRoutes from "./routes/paginaRoutes.js"
import siteMediaRoutes from "./routes/siteMediaRoutes.js"

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


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
