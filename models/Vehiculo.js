import mongoose from "mongoose";

const vehiculoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
        // Ej: Auto, Moto, Camion.
    },
    modelo: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    placa: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
});

export default mongoose.model("Vehiculo", vehiculoSchema);