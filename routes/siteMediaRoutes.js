import express from "express";
import multer from "multer";
import SiteMedia from "../models/SiteMedia.js";

const router = express.Router();

// Multer en memoria (para guardar en MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear o actualizar (si ya existe, reemplaza)
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    let media = await SiteMedia.findOne();

    const data = {
      videoHero: req.body.videoHero,
      videoBienvenida: req.body.videoBienvenida,
    };

    if (req.file) {
      data.imagen = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    if (!media) {
      media = await SiteMedia.create(data);
    } else {
      await SiteMedia.updateOne({}, data);
      media = await SiteMedia.findOne();
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar los datos", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const media = await SiteMedia.findOne().select("-imagen");
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos", error });
  }
});

// Obtener imagen
router.get("/imagen", async (req, res) => {
  try {
    const media = await SiteMedia.findOne();

    if (!media || !media.imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    res.set("Content-Type", media.imagen.contentType);
    res.send(media.imagen.data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen", error });
  }
});

export default router;
