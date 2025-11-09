import mongoose from "mongoose";

const paginaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  titulo: { type: String },
  texto1: { type: String },
  texto2: { type: String }
}, { timestamps: true });

export default mongoose.model("Pagina", paginaSchema);
