import jwt from "jsonwebtoken";
import Usuario from "../../models/Usuario.js";

const mostrarLogin = (req, res) => {
  res.render("login", {
    error: null
  });
};

const mostrarRegistro = (req, res) => {
  res.render("registro", {
    error: null
  });
};

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body; // Obtiene los datos enviados desde el formulario.

    if (!nombre || !email || !password) {
      return res.render("registro", {
        error: "Todos los campos son obligatorios"
      });
    }

    const usuarioExiste = await Usuario.findOne({ email }); // Verifica si el email ya existe.

    if (usuarioExiste) {
      return res.render("registro", {
        error: "Ese email ya esta registrado"
      });
    }

    const { salt, passwordHash } = Usuario.crearPasswordSeguro(password); // Genera hash y salt.

    await Usuario.create({
      nombre,
      email,
      passwordHash,
      salt
    });

    res.redirect("/login");
  } catch (error) {
    res.render("registro", {
      error: "Error al registrar usuario", error: error.message
    });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body; // Obtiene email y password del formulario.

    const usuario = await Usuario.findOne({ email }); // Busca el usuario.

    if (!usuario || !usuario.validarPassword(password)) {
      return res.render("login", {
        error: "Email o password incorrectos"
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    ); // Genera el JWT firmado.

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60
    }); // Guarda el JWT en una cookie segura.

    res.redirect("/");
  } catch (error) {
    res.render("login", {
      error: "Error al iniciar sesion"
    });
  }
};

const cerrarSesion = (req, res) => {
  res.clearCookie("token"); // Elimina la cookie que contiene el JWT.
  res.redirect("/login");
};

export {
  mostrarLogin,
  mostrarRegistro,
  registrarUsuario,
  iniciarSesion,
  cerrarSesion
};