import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso no autorizado, token faltante" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};


export const validarJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No hay token en la petición" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    // guardar SOLO EL ID
    req.uid = id;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token no válido" });
  }
};