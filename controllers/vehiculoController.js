import Vehiculo from "../models/Vehiculo.js";
import Cambios from "../models/Cambios.js";
let Eliminar_Cambios = false

//CREAR
const crearVehiculo = async (req, res) => {
    try {
        console.log("Crear Vehiculo", req.body);
        const nuevoVehiculo = new Vehiculo(req.body);
        const VehiculoGuardado = await nuevoVehiculo.save();
        res.status(201).json(VehiculoGuardado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el Vehiculo...", error: error.message});
    }
};

//LEER TODOS
const obtenerVehiculos = async (req, res) => {
    try {
        const Vehiculos = await Vehiculo.find();
        res.render("index", {
            usuario: req.usuario || "Invitado",
            Vehiculos: Vehiculos
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
        const vehiculoEliminado = await Vehiculo.findOneAndDelete({ placa: req.params.placa });
        
        if (!vehiculoEliminado) {
            return res.status(404).json({ mensaje: "El vehículo no existe." });
        }

        if (Eliminar_Cambios === true){
            await Cambios.deleteMany({ placa: vehiculoEliminado._id });
        }
        
        res.json({
            mensaje: "Vehiculo ha sido eliminado..."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el Vehiculo",  });
    }
};

export {
    crearVehiculo,
    obtenerVehiculos,
    obtenerVehiculoPorID,
    actualizarVehiculo,
    eliminarVehiculo
};