// controllers/soporteControllers.js
import jwt from "jsonwebtoken";
// Importamos tu modelo (ajustá la ruta si no es exacta)
import UsuarioExterno from "../../models/Usuario_Externo.js";
import Chat from "../../models/chats.js";

export const mostrarSoporte = async (req, res) => {
    try {
        let mensajesPrevios = [];

        // Si el usuario está logueado, traemos su chat histórico por su ID único de MongoDB
        if (req.usuario) {
            // CORREGIDO: Buscamos por "usuarioExterno" usando el _id del usuario autenticado
            const chatExistente = await Chat.findOne({ usuarioExterno: req.usuario._id });
            
            if (chatExistente) {
                mensajesPrevios = chatExistente.mensajes; 
            }
        }

        res.render('soporte', { 
            pagina: 'Soporte Técnico',
            usuario: req.usuario || null,
            mensajesPrevios
        });
    } catch (error) {
        console.error("Error al cargar mensajes previos:", error);
        res.render('soporte', {
            pagina: 'Soporte Técnico',
            usuario: req.usuario || null,
            mensajesPrevios: []
        });
    }
};

// Muestra el formulario de login para el cliente
export const mostrarLoginCliente = (req, res) => {
    res.render('soporteLogin', {
        pagina: 'Iniciar Sesión - Soporte'
    });
};

export const mostrarDashboardSoporte = async (req, res) => {
    try {
      const chats = await Chat.find()
        .populate({
          path: 'usuarioExterno',
          model: UsuarioExterno,
          select: 'nombre email'
        })
        .sort({ createdAt: -1 });
  
      res.render('soporteDashboard', { chats });
    } catch (error) {
      console.error("Error al cargar el dashboard de soporte:", error);
      res.status(500).send("Error interno del servidor");
    }
  };

  // Agregá esto a controllers/soporteControllers.js
export const obtenerChatAPI = async (req, res) => {
    try {
      const { id } = req.params;
      const chat = await Chat.findById(id);
      if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
      
      res.json(chat); // Retorna los datos del chat en un JSON puro para el fetch
    } catch (error) {
      res.status(500).json({ error: "Error de servidor" });
    }
  };

// Procesa las credenciales del cliente externo
export const autenticarCliente = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. CORREGIDO: Usamos "UsuarioExterno" (el modelo importado arriba en singular)
        const cliente = await UsuarioExterno.findOne({ email });
        if (!cliente) {
            return res.render('soporteLogin', {
                pagina: 'Iniciar Sesión - Soporte',
                error: 'El correo electrónico no está registrado'
            });
        }

        // 2. Validar la contraseña usando el método definido en tu schema
        const passwordCorrecto = cliente.validarPassword(password);
        if (!passwordCorrecto) {
            return res.render('soporteLogin', {
                pagina: 'Iniciar Sesión - Soporte',
                error: 'Contraseña incorrecta'
            });
        }

        // 3. Generar el JWT exclusivo para clientes
        const token = jwt.sign(
            { id: cliente._id, email: cliente.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 4. Almacenar el token en una cookie separada para no pisar la de empleados
        res.cookie('token_cliente', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });

        // 5. Redireccionamos al panel de soporte de clientes
        return res.redirect('/soporte');

    } catch (error) {
        console.error("Error al autenticar cliente:", error);
        return res.render('soporteLogin', {
            pagina: 'Iniciar Sesión - Soporte',
            error: 'Ocurrió un error inesperado. Intente de nuevo.'
        });
    }
};

// Cierra la sesión del cliente eliminando la cookie correspondiente
export const cerrarSesionCliente = (req, res) => {
    res.clearCookie('token_cliente');
    return res.redirect('/soporte');
};