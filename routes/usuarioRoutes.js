import express from "express";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 🔸 Generar token
const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 📝 Registro
router.post("/registro", async (req, res) => {
  try {
    const { nombre, apellido, rol, correo, contraseña, telefono } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ error: "El correo ya está registrado" });

    const usuario = new Usuario({ nombre, apellido, rol, correo, contraseña, telefono });
    await usuario.save();

    const token = generarToken(usuario._id, usuario.rol);
    res.status(201).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔑 Login
router.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  const usuario = await Usuario.findOne({ correo });
  if (!usuario) return res.status(400).json({ error: "Correo o contraseña incorrectos" });

  const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!esValida) return res.status(400).json({ error: "Correo o contraseña incorrectos" });

  const token = generarToken(usuario._id, usuario.rol);
  res.json({
    _id: usuario._id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    rol: usuario.rol,
    token,
  });
});

// 🔒 Obtener todos los usuarios (solo con token)
router.get("/", protect, async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// 🔒 Obtener uno
router.get("/:id", protect, async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: "No encontrado" });
  res.json(usuario);
});

// 🔒 Actualizar
router.put("/:id", protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.contraseña) {
      const salt = await bcrypt.genSalt(10);
      data.contraseña = await bcrypt.hash(data.contraseña, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔒 Eliminar
router.delete("/:id", protect, async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Usuario eliminado" });
});

export default router;
