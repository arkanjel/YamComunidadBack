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

// export const validarJWT = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ ok: false, msg: "No hay token" });
//   }

//   try {
//     const { uid } = jwt.verify(token, process.env.JWT_SECRET);
//     req.uid = uid;
//     next();
//   } catch (error) {
//     return res.status(401).json({ ok: false, msg: "Token inválido" });
//   }
// };
export const validarJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ ok: false, msg: "No hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // acepta uid o _id o id
    req.uid = decoded.uid || decoded._id || decoded.id;

    if (!req.uid) {
      return res.status(401).json({ ok: false, msg: "Token sin UID" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ ok: false, msg: "Token inválido" });
  }
};