import mongoose from "mongoose";

const beneficioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  texto: { type: String },
  masInfo: { type: Boolean, default: false },
  imagen: { type: String } // guardará el nombre o ruta del archivo
}, { timestamps: true });

export default mongoose.model("Beneficio", beneficioSchema);
