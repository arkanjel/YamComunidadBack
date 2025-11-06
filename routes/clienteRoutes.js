import express from "express";
import Cliente from "../models/Cliente.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// 🧠 Usamos multer en memoria, no en disco
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📦 Crear cliente con logo
router.post("/", protect, upload.single("logo"), async (req, res) => {
  try {
    const { nombre } = req.body;
    const cliente = new Cliente({ nombre });

    if (req.file) {
      cliente.logo.data = req.file.buffer;
      cliente.logo.contentType = req.file.mimetype;
    }

    await cliente.save();
    res.status(201).json({
      _id: cliente._id,
      nombre: cliente.nombre,
      createdAt: cliente.createdAt
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Obtener todos los clientes (con URL pública del logo)
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find().select("nombre createdAt");

    // Generar URL pública para cada logo
    const clientesConUrl = clientes.map((c) => ({
      _id: c._id,
      nombre: c.nombre,
      createdAt: c.createdAt,
      logoUrl: `${req.protocol}://${req.get("host")}/api/clientes/${c._id}/logo`,
    }));

    res.json(clientesConUrl);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error });
  }
});

// ✅ Obtener un cliente por ID (con URL pública del logo)
router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).select("nombre createdAt");

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const clienteConUrl = {
      _id: cliente._id,
      nombre: cliente.nombre,
      createdAt: cliente.createdAt,
      logoUrl: `${req.protocol}://${req.get("host")}/api/clientes/${cliente._id}/logo`,
    };

    res.json(clienteConUrl);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cliente", error });
  }
});


// ✅ Obtener solo el logo de un cliente
router.get("/:id/logo", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente || !cliente.logo || !cliente.logo.data) {
      return res.status(404).json({ message: "Logo no encontrado" });
    }

    res.set("Content-Type", cliente.logo.contentType);
    res.send(cliente.logo.data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el logo", error });
  }
});


// ✏️ Actualizar cliente o logo
router.put("/:id", protect, upload.single("logo"), async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: "No encontrado" });

    if (req.body.nombre) cliente.nombre = req.body.nombre;
    if (req.file) {
      cliente.logo.data = req.file.buffer;
      cliente.logo.contentType = req.file.mimetype;
    }

    await cliente.save();
    res.json({ mensaje: "Cliente actualizado correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Eliminar cliente
router.delete("/:id", protect, async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ error: "No encontrado" });
    res.json({ mensaje: "Cliente eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
