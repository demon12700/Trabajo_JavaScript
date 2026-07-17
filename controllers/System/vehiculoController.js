import UsuarioExterno from "../../models/Usuario_Externo.js";
import Vehiculo from "../../models/Vehiculo.js";
import Cambios from "../../models/Cambios.js";

let Eliminar_Cambios = false

//CREAR
const crearVehiculo = async (req, res) => {
    try {
        console.log("Crear Vehiculo", req.body);
        const { tipo, modelo, color, placa, usrEmail } = req.body;

        const nuevoVehiculo = new Vehiculo({
            tipo,
            modelo,
            color,
            placa,
            usrEmail: usrEmail
        });

        const VehiculoGuardado = await nuevoVehiculo.save();
        res.redirect("/vehiculos");
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el Vehiculo...", error: error.message});
    }
};

//LEER TODOS
const obtenerVehiculos = async (req, res) => {
    try {
        const todosLosVehiculos = await Vehiculo.find();
        const placaQuery = req.query.placa;
        let autoSeleccionado = null;
        let cambiosEncontrados = [];

        if (placaQuery) {
            autoSeleccionado = await Vehiculo.findOne({ placa: placaQuery });
            if (autoSeleccionado) {
                // Busca en la Vehiculos y selecciona uno.
                cambiosEncontrados = await Cambios.find({ placa: autoSeleccionado._id });
            }
        }

        res.render("Vehiculos", {
            usuario: req.usuario || "Invitado",
            listaVehiculos: todosLosVehiculos, 
            placaSeleccionada: placaQuery || "",
            autoSeleccionado: autoSeleccionado,
            cambios: cambiosEncontrados
        });
    } catch (error) {
        res.status(500).send("Error al cargar los Vehiculos");
    }
};

//Buscar POR ID
const obtenerVehiculoPorID = async (req, res) => {
    try {
        const vehiculoEncontrado = await Vehiculo.findOne({ placa: req.params.placa });
        if (!vehiculoEncontrado) {
            return res.status(404).json({ mensaje: "Vehiculo no encontrado en la base de datos..." });
        }
        res.json(vehiculoEncontrado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar Vehiculo en la base de datos...", error: error.message });
    }
};

// ACTUALIZAR
const actualizarVehiculo = async (req, res) => {
    try {
        const VehiculoActualizado = await Vehiculo.findOneAndUpdate(
            { placa: req.params.placa },
            req.body,
            { new: true }
        );

        if (!VehiculoActualizado) {
            return res.status(404).json({ mensaje: "Vehiculo no encontrado para actualizar" });
        }

        res.json(VehiculoActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al intentar actualizar Vehiculo...", error: error.message });
    }
};

// ELIMINAR
const eliminarVehiculo = async (req, res) => {
    try {
        // Leemos si el usuario tildó el checkbox en el formulario de la web
        const { borrarCambios } = req.body;
        
        // Si el checkbox vino marcado, seteamos Eliminar_Cambios a true, de lo contrario false
        Eliminar_Cambios = (borrarCambios === "true");

        const vehiculoEliminado = await Vehiculo.findOneAndDelete({ placa: req.params.placa });
        
        if (!vehiculoEliminado) {
            return res.status(404).render("eliminarVehiculo", {
                error: "El vehículo no existe o ya fue eliminado."
            });
        }
        
        if (Eliminar_Cambios === true) {
            await Cambios.deleteMany({ placa: vehiculoEliminado._id });
        }
        // Devolvemos el estado global a false para futuras peticiones
        Eliminar_Cambios = false;
        res.redirect("/vehiculos");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el Vehiculo: " + error.message);
    }
};

const mostrarFormularioEditar = async (req, res) => {
    try {
        const vehiculoEncontrado = await Vehiculo.findOne({ placa: req.params.placa });
        
        if (!vehiculoEncontrado) {
            return res.redirect("/vehiculos");
        }

        res.render("EditarVehiculo", { 
            vehiculo: vehiculoEncontrado 
        });
    } catch (error) {
        res.status(500).send("Error al cargar el formulario de edición");
    }
};

// NUEVA FUNCIÓN PARA RENDERIZAR "AgregarDatos.pug" CON LOS USUARIOS Y VEHÍCULOS
const mostrarFormularioRegistro = async (req, res) => {
    try {
        // 1. Buscamos todos los usuarios externos registrados (solo traemos nombre y email)
        const usuariosExternos = await UsuarioExterno.find({}, "nombre email").sort({ nombre: 1 });

        // 2. Buscamos todos los vehículos registrados para el selector de Cambios/Reparaciones
        const todosLosVehiculos = await Vehiculo.find().sort({ placa: 1 });

        // 3. Renderizamos la vista pasándole ambas colecciones de datos
        res.render("AgregarDatos", {
            usuariosExternos: usuariosExternos,
            listaVehiculos: todosLosVehiculos
        });
    } catch (error) {
        console.error("Error al cargar la página de registro:", error);
        res.status(500).send("Error al cargar el formulario de registro: " + error.message);
    }
};

const mostrarFormularioEliminar = async (req, res) => {
    try {
        const vehiculoEncontrado = await Vehiculo.findOne({ placa: req.params.placa });
        
        if (!vehiculoEncontrado) {
            return res.redirect("/vehiculos");
        }

        res.render("eliminarVehiculo", { 
            vehiculo: vehiculoEncontrado 
        });
    } catch (error) {
        res.status(500).send("Error al cargar el formulario de eliminación: " + error.message);
    }
};

const actualizarVehiculoWeb = async (req, res) => {
    const placaParam = req.params.placa;
    try {
        const VehiculoActualizado = await Vehiculo.findOneAndUpdate(
            { placa: placaParam },
            req.body,
            { new: true }
        );

        if (!VehiculoActualizado) {
            return res.render("EditarVehiculo", {
                vehiculo: { placa: placaParam, ...req.body },
                error: "Vehiculo no encontrado para actualizar"
            });
        }

        res.redirect("/vehiculos");
    } catch (error) {
        res.render("EditarVehiculo", {
            vehiculo: { placa: placaParam, ...req.body },
            error: "Error al intentar actualizar el Vehiculo: " + error.message
        });
    }
};

export {
    crearVehiculo,
    obtenerVehiculos,
    obtenerVehiculoPorID,
    actualizarVehiculo,
    eliminarVehiculo,
    mostrarFormularioEditar,
    actualizarVehiculoWeb,
    mostrarFormularioEliminar,
    mostrarFormularioRegistro
};