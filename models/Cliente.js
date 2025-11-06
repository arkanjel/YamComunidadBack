import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  logo: {
    data: Buffer,        // almacena los bytes de la imagen
    contentType: String  // tipo MIME (image/png, image/jpeg, etc.)
  }
}, { timestamps: true });

export default mongoose.model("Cliente", clienteSchema);
