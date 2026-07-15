import Usuario_Externo from "../../models/Usuario_Externo.js";

const mostrarFormularioRegistro = (req, res) => {
    res.render("AgregarUsuario");
};



const regristrarUsuarioExterno = async (req, res) => {
    try {
        console.log("Crear cuenta Externa", req.body);
        const { nombre, telefono, email, password } = req.body;

        const usuarioExistente = await Usuario_Externo.findOne({ email });
        if (usuarioExistente) {
            return res.render("AgregarUsuario", { error: "El correo electrónico ya está registrado." });
        }

        const { salt, passwordHash } = Usuario_Externo.crearPasswordSeguro(password);

        // Creamos la instancia con los hashes correspondientes
        const nuevoExterno = new Usuario_Externo({
            nombre,
            telefono,
            email,
            salt,
            passwordHash
        });

        await nuevoExterno.save();
        res.redirect("/"); // Redirige al Home luego de crear con éxito
    } catch (error) {
        res.render("AgregarUsuario", { error: "Error al crear el usuario: " + error.message });
    }
};

const conseguirUsuarios = async (req, res) => {
    try {
        const todosLosUsuarios = await Usuario_Externo.find();
        const emailQuery = req.query.email;
        let UsuarioSeleccionado = null;
        let AutosEncontrados = [];

        if (emailQuery) {
            UsuarioSeleccionado = await Usuario_Externo.findOne({ email: emailQuery });
            if (UsuarioSeleccionado) {
                // Filtramos los vehículos usando "usrEmail" contra el correo del usuario seleccionado
                AutosEncontrados = await Vehiculo.find({ usrEmail: UsuarioSeleccionado.email });
            }
        }

        res.render("Usuarios", {
            usuario: req.usuario || "Invitado",
            listaUsuarios: todosLosUsuarios,
            emailSeleccionado: emailQuery || "",
            UserSeleccionado: UsuarioSeleccionado,
            autos: AutosEncontrados
        });
    } catch (error) {
        res.status(500).send("Error al cargar los usuarios: " + error.message);
    }
};

export {
    mostrarFormularioRegistro,
    regristrarUsuarioExterno,
    conseguirUsuarios
};