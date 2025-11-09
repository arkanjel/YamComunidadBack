import express from "express";
import Pagina from "../models/Pagina.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------
    🟢 Crear página
-------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const pagina = new Pagina(req.body);
    await pagina.save();
    res.status(201).json(pagina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* -------------------
   🔵 Obtener todas
-------------------- */
router.get("/", async (req, res) => {
  const paginas = await Pagina.find();
  res.json(paginas);
});

/* ---------------------------------
   🟡 Obtener una por nombre (ÚNICO)
---------------------------------- */
router.get("/nombre/:nombre", async (req, res) => {
  try {
    const pagina = await Pagina.findOne({ nombre: req.params.nombre });

    if (!pagina) return res.status(404).json({ error: "Página no encontrada" });

    res.json(pagina);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -------------------
   🟠 Actualizar
-------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const pagina = await Pagina.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pagina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* -------------------
   🔴 Eliminar
-------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Pagina.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Página eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
