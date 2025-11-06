import express from "express";
import Beneficio from "../models/Beneficio.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📁 Carpeta donde se guardarán las imágenes
const uploadPath = "uploads";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// 📸 Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // nombre único
  }
});

const upload = multer({ storage });

// 🚀 Crear beneficio con imagen
router.post("/", protect, upload.single("imagen"), async (req, res) => {
  try {
    const { titulo, descripcion, texto, masInfo } = req.body;

    const beneficio = new Beneficio({
      titulo,
      descripcion,
      texto,
      masInfo,
      imagen: req.file ? req.file.filename : null
    });

    await beneficio.save();
    res.status(201).json(beneficio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos
router.get("/", async (req, res) => {
  const beneficios = await Beneficio.find();
  res.json(beneficios);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const beneficio = await Beneficio.findById(req.params.id);
  if (!beneficio) return res.status(404).json({ error: "No encontrado" });
  res.json(beneficio);
});

// Actualizar (opcional con nueva imagen)
router.put("/:id", protect, upload.single("imagen"), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.imagen = req.file.filename;
    }
    const beneficio = await Beneficio.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(beneficio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar
router.delete("/:id", protect, async (req, res) => {
  await Beneficio.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Beneficio eliminado" });
});

export default router;
